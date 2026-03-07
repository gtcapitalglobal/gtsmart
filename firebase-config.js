// =============================================
// GT SMART EQUITY - CONFIGURAÇÃO FIREBASE
// Coloque SUAS credenciais do Firebase aqui
// =============================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAraCosjcg7lSKUqL6PfXyoxC0QcAQ17pE",
  authDomain: "gestao-pessoal-f2a6d-727cc.firebaseapp.com",
  projectId: "gestao-pessoal-f2a6d-727cc",
  storageBucket: "gestao-pessoal-f2a6d-727cc.firebasestorage.app",
  messagingSenderId: "461231828356",
  appId: "1:461231828356:web:396a064a247255345e41d1",
  measurementId: "G-S6GMCW2JV4"
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
    const loans = await getLoans();
    const debts = await getDebts();
    const contracts = await getContracts();

    const backup = {
      exportDate: new Date().toISOString(),
      exportDateFormatted: new Date().toLocaleString('pt-BR'),
      system: 'GT Smart Equity',
      version: '3.0-firebase',
      data: { loans, debts, contracts },
      statistics: {
        totalLoans: loans.length,
        totalDebts: debts.length,
        totalContracts: contracts.length,
        activeLoans: loans.filter(l => l.status === 'active').length,
        archivedLoans: loans.filter(l => l.archived === true).length
      }
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GT_Smart_Backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { loans: loans.length, debts: debts.length, contracts: contracts.length };
  } catch (e) {
    console.error('Erro no backup:', e);
    return null;
  }
}

async function importFullBackup(jsonData) {
  try {
    const backup = JSON.parse(jsonData);
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
  deleteEmpresa
};