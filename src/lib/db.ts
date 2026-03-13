import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  getDocFromServer,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validation Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();

export const productService = {
  async getAll() {
    try {
      const q = query(collection(db, 'products'), where('status', '==', 'active'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
    }
  },

  async getBySlug(slug: string) {
    try {
      const q = query(
        collection(db, 'products'), 
        where('slug', '==', slug),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `products/${slug}`);
    }
  },

  subscribeToProducts(callback: (products: any[]) => void) {
    const q = query(collection(db, 'products'), where('status', '==', 'active'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(products);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
  },

  async getAllAdmin() {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
    }
  },

  async create(productData: any) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        created_at: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  },

  async update(id: string, productData: any) {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, productData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  },

  async delete(id: string) {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  },

  // For seeding
  async seedProducts(products: any[]) {
    try {
      for (const product of products) {
        const q = query(collection(db, 'products'), where('slug', '==', product.slug));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          await addDoc(collection(db, 'products'), {
            ...product,
            created_at: Timestamp.now()
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products/seed');
    }
  }
};

export const orderService = {
  async getAll() {
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    }
  },

  async createOrder(orderData: any) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        created_at: Timestamp.now(),
        uid: auth.currentUser?.uid || null
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  }
};

export const customerService = {
  async getAll() {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const orders = ordersSnapshot.docs.map(doc => doc.data());
      
      const customerMap: Record<string, any> = {};
      
      orders.forEach((order: any) => {
        const email = order.customer_email;
        if (!customerMap[email]) {
          customerMap[email] = {
            name: order.customer_name,
            email: email,
            order_count: 0,
            total_spent: 0,
            last_order: order.created_at?.toDate() || new Date()
          };
        }
        
        customerMap[email].order_count += 1;
        customerMap[email].total_spent += order.total_amount || 0;
        
        const orderDate = order.created_at?.toDate() || new Date();
        if (orderDate > customerMap[email].last_order) {
          customerMap[email].last_order = orderDate;
        }
      });
      
      return Object.values(customerMap);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'customers');
    }
  }
};

export const settingsService = {
  async getSettings() {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Default settings
        return {
          store_name: 'LicensePro',
          support_email: 'support@licensepro.com',
          store_description: 'Premium software licenses at unbeatable prices.',
          currency: 'USD',
          timezone: 'UTC'
        };
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'settings/general');
    }
  },

  async saveSettings(settings: any) {
    try {
      const docRef = doc(db, 'settings', 'general');
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/general');
    }
  }
};

export const statsService = {
  async getStats() {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalSales = orders.reduce((acc: number, curr: any) => acc + (curr.total_amount || 0), 0);
      const totalOrders = orders.length;
      const recentOrders = orders.sort((a: any, b: any) => {
        const dateA = a.created_at?.seconds || 0;
        const dateB = b.created_at?.seconds || 0;
        return dateB - dateA;
      }).slice(0, 5);
      
      // Mock daily revenue for now as it's complex to aggregate in Firestore without cloud functions
      const dailyRevenue = [
        { date: '2026-03-06', revenue: 1200, cost: 400 },
        { date: '2026-03-07', revenue: 1900, cost: 600 },
        { date: '2026-03-08', revenue: 1500, cost: 500 },
        { date: '2026-03-09', revenue: 2100, cost: 700 },
        { date: '2026-03-10', revenue: 2500, cost: 800 },
        { date: '2026-03-11', revenue: 2200, cost: 750 },
        { date: '2026-03-12', revenue: 2800, cost: 900 },
      ];

      return {
        totalSales,
        totalOrders,
        recentOrders,
        dailyRevenue
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'stats');
    }
  }
};
