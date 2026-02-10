import { collection, doc, writeBatch, getDocs, addDoc, updateDoc, deleteDoc, Firestore, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ContentBlock, PageContent } from '@/types';
import { initializeFirebase } from '@/firebase';
import pageData from './initial-data.json';


export async function getDb() {
    const { firestore } = initializeFirebase();
    return firestore;
}

export async function updateDocument(path: string, data: any) {
    const db = await getDb();
    const docRef = doc(db, path);
    return updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function deleteDocument(path: string) {
    const db = await getDb();
    const docRef = doc(db, path);
    return deleteDoc(docRef);
}

export async function addBlock(pageId: string, blockData: Partial<ContentBlock>, column?: number) {
    const db = await getDb();
    const blocksRef = collection(db, `pages/${pageId}/blocks`);
    const q = query(blocksRef, orderBy('order', 'desc'));
    const querySnapshot = await getDocs(q);
    const lastOrder = querySnapshot.docs[0]?.data()?.order ?? 0;
    
    const newBlock: Omit<ContentBlock, 'id'> = {
        type: blockData.type || 'text',
        order: lastOrder + 1,
        ...blockData
    };

    if (column) {
      (newBlock as any).column = column;
    }

    return addDoc(blocksRef, newBlock);
}

export async function addPage() {
    const db = await getDb();
    const pagesRef = collection(db, 'pages');
    
    const pagesSnapshot = await getDocs(pagesRef);
    const orders = pagesSnapshot.docs
        .map(doc => doc.data().order)
        .filter(order => typeof order === 'number');

    let newOrder = 0;
    if (orders.length > 0) {
        newOrder = Math.max(...orders) + 1;
    } else {
        newOrder = pagesSnapshot.size;
    }

    const newPage = {
        title: "New Page Section",
        layout: "single" as const,
        createdAt: serverTimestamp(),
        order: newOrder,
    };
    return addDoc(pagesRef, newPage);
}

export async function ensureHeaderPage() {
    const db = await getDb();
    const pageRef = doc(db, 'pages', 'header');
    return setDoc(pageRef, {
        title: "Header Section",
        layout: "single",
        createdAt: serverTimestamp(),
        order: -1,
    });
}

export async function deletePage(pageId: string) {
    const db = await getDb();
    const batch = writeBatch(db);

    const blocksRef = collection(db, `pages/${pageId}/blocks`);
    const blocksSnapshot = await getDocs(blocksRef);
    blocksSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    const pageRef = doc(db, `pages/${pageId}`);
    batch.delete(pageRef);

    return batch.commit();
}

export async function swapBlockOrder(pageId: string, blockA: ContentBlock, blockB: ContentBlock) {
    const db = await getDb();
    const batch = writeBatch(db);

    const blockARef = doc(db, `pages/${pageId}/blocks`, blockA.id);
    const blockBRef = doc(db, `pages/${pageId}/blocks`, blockB.id);

    // Swap the order property
    batch.update(blockARef, { order: blockB.order });
    batch.update(blockBRef, { order: blockA.order });

    return batch.commit();
}

export async function swapPageOrder(pageA: PageContent, pageB: PageContent) {
    const db = await getDb();
    
    const pagesRef = collection(db, 'pages');
    const pagesSnapshot = await getDocs(query(pagesRef, orderBy('createdAt', 'asc')));
    const pagesWithIndex = pagesSnapshot.docs.map((doc, index) => ({id: doc.id, ...doc.data(), autoIndex: index} as PageContent & {autoIndex: number}));
    
    const pageAWithIndex = pagesWithIndex.find(p => p.id === pageA.id);
    const pageBWithIndex = pagesWithIndex.find(p => p.id === pageB.id);

    const orderA = pageA.order ?? pageAWithIndex?.autoIndex;
    const orderB = pageB.order ?? pageBWithIndex?.autoIndex;
    
    if (orderA === undefined || orderB === undefined) {
        throw new Error("Could not determine order for swapping pages.");
    }

    const batch = writeBatch(db);
    const pageARef = doc(db, 'pages', pageA.id);
    const pageBRef = doc(db, 'pages', pageB.id);

    batch.update(pageARef, { order: orderB });
    batch.update(pageBRef, { order: orderA });

    return batch.commit();
}

export async function sendMessage(data: { email?: string; message: string }) {
    const db = await getDb();
    const messagesRef = collection(db, 'messages');
    return addDoc(messagesRef, {
        ...data,
        createdAt: serverTimestamp()
    });
}

export async function deleteMessage(messageId: string) {
    const db = await getDb();
    const docRef = doc(db, 'messages', messageId);
    return deleteDoc(docRef);
}


// Seed function
export async function seedDatabase(db: Firestore) {
  const pagesCollectionRef = collection(db, 'pages');
  const querySnapshot = await getDocs(pagesCollectionRef);

  if (querySnapshot.size > 0) {
    return;
  }
  
  const batch = writeBatch(db);

  for (const page of pageData.pages) {
    const pageRef = doc(db, 'pages', page.id);
    const { blocks, ...pageContent } = page;
    batch.set(pageRef, {
        ...pageContent,
        createdAt: serverTimestamp(),
        order: pageData.pages.indexOf(page),
    });

    if (blocks) {
      for (const block of blocks) {
        const blockRef = doc(db, `pages/${page.id}/blocks`, block.id);
        batch.set(blockRef, block);
      }
    }
  }

  await batch.commit();
}
