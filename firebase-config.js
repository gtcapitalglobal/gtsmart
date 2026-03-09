// =============================================
// GT SMART EQUITY - CONFIGURAÇÃO FIREBASE
// Coloque SUAS credenciais do Firebase aqui
// =============================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCAt7D5HOkdXZEV9o_DZck9pjPoGKW-GSY",
  authDomain: "gtsmart-387b4.firebaseapp.com",
  projectId: "gtsmart-387b4",
  storageBucket: "gtsmart-387b4.firebasestorage.app",
  messagingSenderId: "319681648843",
  appId: "1:319681648843:web:8d9974ffa13d070850a34e"
};

// =============================================
// NÃO MEXA ABAIXO DESTA LINHA
// =============================================

// Inicializar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);

// =============================================
// FUNÇÕES DE EMPRÉSTIMOS
// =============================================

async function getLoans() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snapshot = await getDocs(collection(db, 'users', userId, 'loans'));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (e) {
    console.error('Erro ao carregar empréstimos:', e);
    return [];
  }
}

async function saveLoan(loan) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    const loanRef = doc(db, 'users', userId, 'loans', loan.id);
    await setDoc(loanRef, loan);
    return true;
  } catch (e) {
    console.error('Erro ao salvar empréstimo:', e);
    return false;
  }
}

async function updateLoan(loanId, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    const loanRef = doc(db, 'users', userId, 'loans', loanId);
    await updateDoc(loanRef, data);
    return true;
  } catch (e) {
    console.error('Erro ao atualizar empréstimo:', e);
    return false;
  }
}

async function deleteLoan(loanId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    await deleteDoc(doc(db, 'users', userId, 'loans', loanId));
    return true;
  } catch (e) {
    console.error('Erro ao deletar empréstimo:', e);
    return false;
  }
}

// =============================================
// FUNÇÕES DE DÍVIDAS
// =============================================

async function getDebts() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snapshot = await getDocs(collection(db, 'users', userId, 'debts'));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (e) {
    console.error('Erro ao carregar dívidas:', e);
    return [];
  }
}

async function saveDebt(debt) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    const debtRef = doc(db, 'users', userId, 'debts', debt.id);
    await setDoc(debtRef, debt);
    return true;
  } catch (e) {
    console.error('Erro ao salvar dívida:', e);
    return false;
  }
}

async function updateDebt(debtId, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    const debtRef = doc(db, 'users', userId, 'debts', debtId);
    await updateDoc(debtRef, data);
    return true;
  } catch (e) {
    console.error('Erro ao atualizar dívida:', e);
    return false;
  }
}

async function deleteDebt(debtId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    await deleteDoc(doc(db, 'users', userId, 'debts', debtId));
    return true;
  } catch (e) {
    console.error('Erro ao deletar dívida:', e);
    return false;
  }
}

// =============================================
// FUNÇÕES DE CONTRATOS
// =============================================

async function getContracts() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snapshot = await getDocs(collection(db, 'users', userId, 'contracts'));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (e) {
    console.error('Erro ao carregar contratos:', e);
    return [];
  }
}

async function saveContract(contract) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    const contractRef = doc(db, 'users', userId, 'contracts', contract.id);
    await setDoc(contractRef, contract);
    return true;
  } catch (e) {
    console.error('Erro ao salvar contrato:', e);
    return false;
  }
}

async function deleteContract(contractId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    await deleteDoc(doc(db, 'users', userId, 'contracts', contractId));
    return true;
  } catch (e) {
    console.error('Erro ao deletar contrato:', e);
    return false;
  }
}

// =============================================
// BACKUP COMPLETO
// =============================================

async function exportFullBackup() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');

    // Coletas principais
    const loans     = await getLoans();
    const debts     = await getDebts();
    const contracts = await getContracts();
    const cards     = await getCards();
    const empresas  = await getEmpresas();

    // DeFi Pools
    let defiPools = [];
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'defi_pools'));
      defiPools = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch(e) { console.warn('defi_pools vazio ou erro:', e); }

    // DeFi Borrows
    let defiBorrows = [];
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'defi_borrows'));
      defiBorrows = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch(e) { console.warn('defi_borrows vazio ou erro:', e); }

    // Cripto — favoritos e pools
    let cryptoFavorites = null, stableFavorites = null, cryptoPools = null;
    try {
      const cf = await getDoc(doc(db, 'users', userId, 'settings', 'crypto_favorites'));
      if (cf.exists()) cryptoFavorites = cf.data();
    } catch(e) {}
    try {
      const sf = await getDoc(doc(db, 'users', userId, 'settings', 'stable_favorites'));
      if (sf.exists()) stableFavorites = sf.data();
    } catch(e) {}
    try {
      const cp = await getDoc(doc(db, 'users', userId, 'settings', 'crypto_pools'));
      if (cp.exists()) cryptoPools = cp.data();
    } catch(e) {}

    const backup = {
      exportDate: new Date().toISOString(),
      exportDateFormatted: new Date().toLocaleString('pt-BR'),
      system: 'GT Smart Equity',
      version: '4.0-firebase-completo',
      data: {
        loans,
        debts,
        contracts,
        cards,
        empresas,
        defiPools,
        defiBorrows,
        cripto: { cryptoFavorites, stableFavorites, cryptoPools }
      },
      statistics: {
        totalLoans: loans.length,
        totalDebts: debts.length,
        totalContracts: contracts.length,
        totalCards: cards.length,
        totalEmpresas: empresas.length,
        totalDefiPools: defiPools.length,
        totalDefiBorrows: defiBorrows.length,
        activeLoans: loans.filter(l => l.status === 'active').length,
        archivedLoans: loans.filter(l => l.archived === true).length
      }
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GT_Smart_Backup_COMPLETO_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return {
      loans: loans.length,
      debts: debts.length,
      contracts: contracts.length,
      cards: cards.length,
      empresas: empresas.length,
      defiPools: defiPools.length,
      defiBorrows: defiBorrows.length
    };
  } catch (e) {
    console.error('Erro no backup:', e);
    return null;
  }
}

async function importFullBackup(jsonData) {
  try {
    const backup = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (!backup.data || backup.system !== 'GT Smart Equity') {
      throw new Error('Arquivo inválido');
    }

    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');

    // Importar empréstimos
    if (backup.data.loans) {
      for (const loan of backup.data.loans) {
        await setDoc(doc(db, 'users', userId, 'loans', loan.id), loan);
      }
    }

    // Importar dívidas
    if (backup.data.debts) {
      for (const debt of backup.data.debts) {
        await setDoc(doc(db, 'users', userId, 'debts', debt.id), debt);
      }
    }

    // Importar contratos
    if (backup.data.contracts) {
      for (const contract of backup.data.contracts) {
        await setDoc(doc(db, 'users', userId, 'contracts', contract.id), contract);
      }
    }

    // Importar cartões
    if (backup.data.cards) {
      for (const card of backup.data.cards) {
        await setDoc(doc(db, 'users', userId, 'cards', card.id), card);
      }
    }

    // Importar empresas
    if (backup.data.empresas) {
      for (const empresa of backup.data.empresas) {
        await setDoc(doc(db, 'users', userId, 'empresas', empresa.id), empresa);
      }
    }

    // Importar DeFi Pools
    if (backup.data.defiPools) {
      for (const pool of backup.data.defiPools) {
        await setDoc(doc(db, 'users', userId, 'defi_pools', pool.id), pool);
      }
    }

    // Importar DeFi Borrows
    if (backup.data.defiBorrows) {
      for (const borrow of backup.data.defiBorrows) {
        await setDoc(doc(db, 'users', userId, 'defi_borrows', borrow.id), borrow);
      }
    }

    // Importar Cripto (settings)
    if (backup.data.cripto) {
      const { cryptoFavorites, stableFavorites, cryptoPools } = backup.data.cripto;
      if (cryptoFavorites) await setDoc(doc(db, 'users', userId, 'settings', 'crypto_favorites'), cryptoFavorites);
      if (stableFavorites) await setDoc(doc(db, 'users', userId, 'settings', 'stable_favorites'), stableFavorites);
      if (cryptoPools)     await setDoc(doc(db, 'users', userId, 'settings', 'crypto_pools'), cryptoPools);
    }

    return true;
  } catch (e) {
    console.error('Erro ao importar backup:', e);
    return false;
  }
}

// =============================================
// MIGRAÇÃO DO LOCALSTORAGE → FIREBASE
// =============================================

async function migrateFromLocalStorage() {
  try {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) throw new Error('Nao autenticado');

    let migrated = { loans: 0, debts: 0, contracts: 0 };

    function makeId(prefix) {
      return prefix + '_' + String(Date.now()) + '_' + Math.random().toString(36).substr(2, 6);
    }
    function safeId(id, prefix) {
      if (id === null || id === undefined) return makeId(prefix);
      var s = String(id).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 80);
      return s.length > 0 ? s : makeId(prefix);
    }

    var localLoans = JSON.parse(localStorage.getItem('gtSmartLoans') || '[]');
    for (var i = 0; i < localLoans.length; i++) {
      var loan = localLoans[i];
      var loanId = safeId(loan.id, 'LOAN');
      loan.id = loanId;
      await setDoc(doc(db, 'users', userId, 'loans', loanId), loan);
      migrated.loans++;
    }

    var localDebts = JSON.parse(localStorage.getItem('gtSmartDebts') || '[]');
    for (var j = 0; j < localDebts.length; j++) {
      var debt = localDebts[j];
      var debtId = safeId(debt.id, 'DEBT');
      debt.id = debtId;
      await setDoc(doc(db, 'users', userId, 'debts', debtId), debt);
      migrated.debts++;
    }

    var localContracts = JSON.parse(localStorage.getItem('gtSmartContracts') || '[]');
    for (var k = 0; k < localContracts.length; k++) {
      var contract = localContracts[k];
      var contractId = safeId(contract.id, 'CONTRACT');
      contract.id = contractId;
      await setDoc(doc(db, 'users', userId, 'contracts', contractId), contract);
      migrated.contracts++;
    }

    localStorage.removeItem('gtSmartLoans');
    localStorage.removeItem('gtSmartDebts');
    localStorage.removeItem('gtSmartContracts');
    localStorage.setItem('gtSmartMigrated', 'true');

    return migrated;
  } catch (e) {
    console.error('Erro na migracao:', e);
    return null;
  }
}

// =============================================
// EXPORTAR FUNÇÕES
// =============================================


// =============================================
// CARTÕES
// =============================================

async function getCards() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'cards'));
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch(e) { console.error('Erro getCards:', e); return []; }
}

async function saveCard(card) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...data } = card;
    const cardId = id || ('CARD' + Date.now());
    await setDoc(doc(db, 'users', userId, 'cards', cardId), data);
    return cardId;
  } catch(e) { console.error('Erro saveCard:', e); return null; }
}

async function updateCard(card) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...data } = card;
    await setDoc(doc(db, 'users', userId, 'cards', id), data);
    return true;
  } catch(e) { console.error('Erro updateCard:', e); return null; }
}

async function deleteCard(cardId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    await deleteDoc(doc(db, 'users', userId, 'cards', cardId));
    return true;
  } catch(e) { console.error('Erro deleteCard:', e); return null; }
}
async function getEmpresas() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'empresas'));
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch(e) { console.error('Erro getEmpresas:', e); return []; }
}

async function saveEmpresa(empresa) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...data } = empresa;
    const empId = id || ('EMP' + Date.now());
    await setDoc(doc(db, 'users', userId, 'empresas', empId), data);
    return empId;
  } catch(e) { console.error('Erro saveEmpresa:', e); return null; }
}

async function updateEmpresa(empresa) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...data } = empresa;
    await setDoc(doc(db, 'users', userId, 'empresas', id), data);
    return true;
  } catch(e) { console.error('Erro updateEmpresa:', e); return null; }
}

async function deleteEmpresa(empresaId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    await deleteDoc(doc(db, 'users', userId, 'empresas', empresaId));
    return true;
  } catch(e) { console.error('Erro deleteEmpresa:', e); return null; }
}

// =============================================
// FUNÇÕES DEFI
// =============================================

async function getDefiPools() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'defi_pools'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e) { console.error('Erro getDefiPools:', e); return []; }
}

async function getDefiBorrows() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'defi_borrows'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e) { console.error('Erro getDefiBorrows:', e); return []; }
}

export {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  getLoans,
  saveLoan,
  updateLoan,
  deleteLoan,
  getDebts,
  saveDebt,
  updateDebt,
  deleteDebt,
  getContracts,
  saveContract,
  deleteContract,
  exportFullBackup,
  importFullBackup,
  migrateFromLocalStorage,
  getCards,
  saveCard,
  updateCard,
  deleteCard,
  getEmpresas,
  saveEmpresa,
  updateEmpresa,
  deleteEmpresa,
  getDefiPools,
  getDefiBorrows
};