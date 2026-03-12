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
    _gtNotify('✅ Empréstimo salvo!', 'sucesso');
    return true;
  } catch (e) {
    console.error('Erro ao salvar empréstimo:', e);
    _gtNotify('❌ Erro ao salvar empréstimo', 'erro');
    return false;
  }
}

async function updateLoan(loanId, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    const loanRef = doc(db, 'users', userId, 'loans', loanId);
    await updateDoc(loanRef, data);
    _gtNotify('✅ Empréstimo atualizado!', 'sucesso');
    return true;
  } catch (e) {
    console.error('Erro ao atualizar empréstimo:', e);
    _gtNotify('❌ Erro ao atualizar empréstimo', 'erro');
    return false;
  }
}

async function deleteLoan(loanId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    await deleteDoc(doc(db, 'users', userId, 'loans', loanId));
    _gtNotify('🗑️ Empréstimo removido', 'aviso');
    return true;
  } catch (e) {
    console.error('Erro ao deletar empréstimo:', e);
    _gtNotify('❌ Erro ao remover', 'erro');
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
    _gtNotify('✅ Dívida salva!', 'sucesso');
    return true;
  } catch (e) {
    console.error('Erro ao salvar dívida:', e);
    _gtNotify('❌ Erro ao salvar dívida', 'erro');
    return false;
  }
}

async function updateDebt(debtId, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    const debtRef = doc(db, 'users', userId, 'debts', debtId);
    await updateDoc(debtRef, data);
    _gtNotify('✅ Dívida atualizada!', 'sucesso');
    return true;
  } catch (e) {
    console.error('Erro ao atualizar dívida:', e);
    _gtNotify('❌ Erro ao atualizar dívida', 'erro');
    return false;
  }
}

async function deleteDebt(debtId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    await deleteDoc(doc(db, 'users', userId, 'debts', debtId));
    _gtNotify('🗑️ Dívida removida', 'aviso');
    return true;
  } catch (e) {
    console.error('Erro ao deletar dívida:', e);
    _gtNotify('❌ Erro ao remover', 'erro');
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
    _gtNotify('✅ Contrato salvo!', 'sucesso');
    return true;
  } catch (e) {
    console.error('Erro ao salvar contrato:', e);
    _gtNotify('❌ Erro ao salvar contrato', 'erro');
    return false;
  }
}

async function updateContract(contractId, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    await updateDoc(doc(db, 'users', userId, 'contracts', contractId), data);
    _gtNotify('✅ Contrato atualizado!', 'sucesso');
    return true;
  } catch (e) {
    console.error('Erro ao atualizar contrato:', e);
    _gtNotify('❌ Erro ao atualizar contrato', 'erro');
    return false;
  }
}

async function deleteContract(contractId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Não autenticado');
    await deleteDoc(doc(db, 'users', userId, 'contracts', contractId));
    _gtNotify('🗑️ Contrato removido', 'aviso');
    return true;
  } catch (e) {
    console.error('Erro ao deletar contrato:', e);
    _gtNotify('❌ Erro ao remover contrato', 'erro');
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

    // DeFi Colateral
    let defiColateral = [];
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'defi_colateral'));
      defiColateral = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch(e) { console.warn('defi_colateral vazio ou erro:', e); }

    // DeFi Fee Records
    let defiFeeRecords = [];
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'defi_fee_records'));
      defiFeeRecords = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch(e) { console.warn('defi_fee_records vazio ou erro:', e); }

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

    // Ledgerlands — todas as coleções
    let llBuyers = [], llContracts = [], llInstallments = [], llPayments = [], llProperties = [];
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'll_buyers'));
      llBuyers = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch(e) { console.warn('ll_buyers vazio ou erro:', e); }
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'll_contracts'));
      llContracts = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch(e) { console.warn('ll_contracts vazio ou erro:', e); }
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'll_installments'));
      llInstallments = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch(e) { console.warn('ll_installments vazio ou erro:', e); }
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'll_payments'));
      llPayments = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch(e) { console.warn('ll_payments vazio ou erro:', e); }
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'll_properties'));
      llProperties = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch(e) { console.warn('ll_properties vazio ou erro:', e); }

    const backup = {
      exportDate: new Date().toISOString(),
      exportDateFormatted: new Date().toLocaleString('pt-BR'),
      system: 'GT Smart Equity',
      version: '7.0-completo',
      data: {
        loans,
        debts,
        contracts,
        cards,
        empresas,
        defiPools,
        defiBorrows,
        defiColateral,
        defiFeeRecords,
        cripto: { cryptoFavorites, stableFavorites, cryptoPools },
        // Ledgerlands
        llBuyers,
        llContracts,
        llInstallments,
        llPayments,
        llProperties
      },
      statistics: {
        totalLoans: loans.length,
        totalDebts: debts.length,
        totalContracts: contracts.length,
        totalCards: cards.length,
        totalEmpresas: empresas.length,
        totalDefiPools: defiPools.length,
        totalDefiBorrows: defiBorrows.length,
        totalDefiColateral: defiColateral.length,
        totalDefiFeeRecords: defiFeeRecords.length,
        activeLoans: loans.filter(l => l.status === 'active').length,
        archivedLoans: loans.filter(l => l.archived === true).length,
        // Ledgerlands
        totalLLBuyers: llBuyers.length,
        totalLLContracts: llContracts.length,
        totalLLInstallments: llInstallments.length,
        totalLLPayments: llPayments.length,
        totalLLProperties: llProperties.length
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
      defiBorrows: defiBorrows.length,
      llBuyers: llBuyers.length,
      llContracts: llContracts.length,
      llInstallments: llInstallments.length,
      llPayments: llPayments.length,
      llProperties: llProperties.length
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


    // Importar DeFi Colateral
    if (backup.data.defiColateral) {
      for (const pos of backup.data.defiColateral) {
        await setDoc(doc(db, 'users', userId, 'defi_colateral', pos.id), pos);
      }
    }

    // Importar DeFi Fee Records
    if (backup.data.defiFeeRecords) {
      for (const fee of backup.data.defiFeeRecords) {
        await setDoc(doc(db, 'users', userId, 'defi_fee_records', fee.id), fee);
      }
    }
    // Importar Cripto (settings)
    if (backup.data.cripto) {
      const { cryptoFavorites, stableFavorites, cryptoPools } = backup.data.cripto;
      if (cryptoFavorites) await setDoc(doc(db, 'users', userId, 'settings', 'crypto_favorites'), cryptoFavorites);
      if (stableFavorites) await setDoc(doc(db, 'users', userId, 'settings', 'stable_favorites'), stableFavorites);
      if (cryptoPools)     await setDoc(doc(db, 'users', userId, 'settings', 'crypto_pools'), cryptoPools);
    }

    // Importar Ledgerlands — Buyers
    if (backup.data.llBuyers) {
      for (const item of backup.data.llBuyers) {
        await setDoc(doc(db, 'users', userId, 'll_buyers', item.id), item);
      }
    }

    // Importar Ledgerlands — Contratos
    if (backup.data.llContracts) {
      for (const item of backup.data.llContracts) {
        await setDoc(doc(db, 'users', userId, 'll_contracts', item.id), item);
      }
    }

    // Importar Ledgerlands — Parcelas
    if (backup.data.llInstallments) {
      for (const item of backup.data.llInstallments) {
        await setDoc(doc(db, 'users', userId, 'll_installments', item.id), item);
      }
    }

    // Importar Ledgerlands — Pagamentos
    if (backup.data.llPayments) {
      for (const item of backup.data.llPayments) {
        await setDoc(doc(db, 'users', userId, 'll_payments', item.id), item);
      }
    }

    // Importar Ledgerlands — Propriedades
    if (backup.data.llProperties) {
      for (const item of backup.data.llProperties) {
        await setDoc(doc(db, 'users', userId, 'll_properties', item.id), item);
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
    _gtNotify('✅ Cartão salvo!', 'sucesso');
    return cardId;
  } catch(e) { console.error('Erro saveCard:', e); _gtNotify('❌ Erro ao salvar cartão', 'erro'); return null; }
}

async function updateCard(card) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...data } = card;
    await setDoc(doc(db, 'users', userId, 'cards', id), data);
    _gtNotify('✅ Cartão atualizado!', 'sucesso');
    return true;
  } catch(e) { console.error('Erro updateCard:', e); _gtNotify('❌ Erro ao atualizar cartão', 'erro'); return null; }
}

async function deleteCard(cardId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    await deleteDoc(doc(db, 'users', userId, 'cards', cardId));
    _gtNotify('🗑️ Cartão removido', 'aviso');
    return true;
  } catch(e) { console.error('Erro deleteCard:', e); _gtNotify('❌ Erro ao remover cartão', 'erro'); return null; }
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
    _gtNotify('✅ Empresa salva!', 'sucesso');
    return empId;
  } catch(e) { console.error('Erro saveEmpresa:', e); _gtNotify('❌ Erro ao salvar empresa', 'erro'); return null; }
}

async function updateEmpresa(empresa) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...data } = empresa;
    await setDoc(doc(db, 'users', userId, 'empresas', id), data);
    _gtNotify('✅ Empresa atualizada!', 'sucesso');
    return true;
  } catch(e) { console.error('Erro updateEmpresa:', e); _gtNotify('❌ Erro ao atualizar empresa', 'erro'); return null; }
}

async function deleteEmpresa(empresaId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    await deleteDoc(doc(db, 'users', userId, 'empresas', empresaId));
    _gtNotify('🗑️ Empresa removida', 'aviso');
    return true;
  } catch(e) { console.error('Erro deleteEmpresa:', e); _gtNotify('❌ Erro ao remover empresa', 'erro'); return null; }
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

async function saveDefiPool(data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...rest } = data;
    const poolId = id || ('POOL' + Date.now());
    await setDoc(doc(db, 'users', userId, 'defi_pools', poolId), rest);
    _gtNotify('✅ Pool salva!', 'sucesso');
    return poolId;
  } catch(e) { console.error('Erro saveDefiPool:', e); _gtNotify('❌ Erro ao salvar pool', 'erro'); return null; }
}

async function updateDefiPool(id, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await setDoc(doc(db, 'users', userId, 'defi_pools', id), data);
    return true;
  } catch(e) { console.error('Erro updateDefiPool:', e); return false; }
}

async function deleteDefiPool(id) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await deleteDoc(doc(db, 'users', userId, 'defi_pools', id));
    _gtNotify('🗑️ Pool removida', 'aviso');
    return true;
  } catch(e) { console.error('Erro deleteDefiPool:', e); _gtNotify('❌ Erro ao remover pool', 'erro'); return false; }
}

async function getDefiBorrows() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'defi_borrows'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e) { console.error('Erro getDefiBorrows:', e); return []; }
}

async function saveDefiBorrow(data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...rest } = data;
    const borrowId = id || ('BRW' + Date.now());
    await setDoc(doc(db, 'users', userId, 'defi_borrows', borrowId), rest);
    _gtNotify('✅ Borrow salvo!', 'sucesso');
    return borrowId;
  } catch(e) { console.error('Erro saveDefiBorrow:', e); _gtNotify('❌ Erro ao salvar borrow', 'erro'); return null; }
}

async function updateDefiBorrow(id, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await setDoc(doc(db, 'users', userId, 'defi_borrows', id), data);
    return true;
  } catch(e) { console.error('Erro updateDefiBorrow:', e); return false; }
}

async function deleteDefiBorrow(id) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await deleteDoc(doc(db, 'users', userId, 'defi_borrows', id));
    _gtNotify('🗑️ Borrow removido', 'aviso');
    return true;
  } catch(e) { console.error('Erro deleteDefiBorrow:', e); _gtNotify('❌ Erro ao remover borrow', 'erro'); return false; }
}

// =============================================
// FUNÇÕES DEFI — COLATERAL (getDefiPositions)
// =============================================

async function getDefiPositions() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'defi_colateral'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e) { console.error('Erro getDefiPositions:', e); return []; }
}

async function saveDefiPosition(data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...rest } = data;
    const posId = id || ('POS' + Date.now());
    await setDoc(doc(db, 'users', userId, 'defi_colateral', posId), rest);
    _gtNotify('✅ Colateral salvo!', 'sucesso');
    return posId;
  } catch(e) { console.error('Erro saveDefiPosition:', e); _gtNotify('❌ Erro ao salvar colateral', 'erro'); return null; }
}

async function updateDefiPosition(id, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await setDoc(doc(db, 'users', userId, 'defi_colateral', id), data);
    _gtNotify('✅ Colateral atualizado!', 'sucesso');
    return true;
  } catch(e) { console.error('Erro updateDefiPosition:', e); _gtNotify('❌ Erro ao atualizar colateral', 'erro'); return false; }
}

async function deleteDefiPosition(id) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await deleteDoc(doc(db, 'users', userId, 'defi_colateral', id));
    _gtNotify('🗑️ Colateral removido', 'aviso');
    return true;
  } catch(e) { console.error('Erro deleteDefiPosition:', e); _gtNotify('❌ Erro ao remover colateral', 'erro'); return false; }
}

// =============================================
// CONFIGURAÇÕES DO USUÁRIO (getUserSetting / saveUserSetting)
// =============================================

async function getUserSetting(key) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const snap = await getDoc(doc(db, 'users', userId, 'settings', key));
    return snap.exists() ? snap.data().value : null;
  } catch(e) { console.error('Erro getUserSetting:', e); return null; }
}

async function saveUserSetting(key, value) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await setDoc(doc(db, 'users', userId, 'settings', key), { value });
    return true;
  } catch(e) { console.error('Erro saveUserSetting:', e); return false; }
}

// ============================================================
// HELPER INTERNO — notificação automática em save/update/delete
// ============================================================

function _gtNotify(msg, tipo) {
  // Chama showGTToast se o DOM estiver disponível
  if (typeof document !== 'undefined') {
    setTimeout(() => showGTToast(msg, tipo), 50);
  }
}

// ============================================================
// MONITOR DE REDE — aparece automaticamente em qualquer página
// ============================================================

function _setupNetworkMonitor() {
  function mostrarBannerOffline() {
    if (document.getElementById('gt-offline-banner')) return;
    const el = document.createElement('div');
    el.id = 'gt-offline-banner';
    el.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0',
      'background:#c62828', 'color:white', 'text-align:center',
      'padding:11px 16px', 'font-size:13px', 'font-weight:700',
      'z-index:99999', 'box-shadow:0 2px 8px rgba(0,0,0,0.4)',
      'display:flex', 'align-items:center', 'justify-content:center', 'gap:8px'
    ].join(';');
    el.innerHTML = '📡 Sem internet — suas alterações não serão salvas até reconectar.';
    document.body.prepend(el);
    // Empurra o conteúdo pra baixo para não cobrir nada importante
    document.body.style.paddingTop = (parseInt(document.body.style.paddingTop || '0') + 44) + 'px';
  }
  function esconderBannerOffline() {
    const el = document.getElementById('gt-offline-banner');
    if (!el) return;
    document.body.style.paddingTop = Math.max(0, parseInt(document.body.style.paddingTop || '0') - 44) + 'px';
    el.remove();
    // Mostra confirmação de reconexão por 3 segundos
    showGTToast('🌐 Conexão restaurada!', 'sucesso');
  }
  if (!navigator.onLine) mostrarBannerOffline();
  window.addEventListener('offline', mostrarBannerOffline);
  window.addEventListener('online', esconderBannerOffline);
}

// Roda quando o DOM estiver pronto
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _setupNetworkMonitor);
  } else {
    setTimeout(_setupNetworkMonitor, 0);
  }
}

// ============================================================
// LOADING OVERLAY — showGTLoading() / hideGTLoading()
// ============================================================

export function showGTLoading(msg = 'Carregando...') {
  let el = document.getElementById('gt-loading-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'gt-loading-overlay';
    el.style.cssText = [
      'position:fixed','top:0','left:0','right:0','bottom:0',
      'background:rgba(0,0,0,0.45)','z-index:99997',
      'display:flex','align-items:center','justify-content:center',
      'flex-direction:column','gap:14px'
    ].join(';');
    el.innerHTML = '<div style="background:white;padding:24px 32px;border-radius:14px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.3);max-width:280px;">'
      + '<div style="font-size:28px;margin-bottom:10px;">⏳</div>'
      + '<div id="gt-loading-msg" style="font-size:14px;font-weight:700;color:#333;">' + msg + '</div>'
      + '</div>';
    document.body.appendChild(el);
  } else {
    const msgEl = document.getElementById('gt-loading-msg');
    if (msgEl) msgEl.textContent = msg;
    el.style.display = 'flex';
  }
}

export function hideGTLoading() {
  const el = document.getElementById('gt-loading-overlay');
  if (el) el.style.display = 'none';
}

// ============================================================
// TOAST DE NOTIFICAÇÃO — use em qualquer página
// showGTToast('mensagem') ou showGTToast('mensagem', 'sucesso' | 'aviso' | 'erro')
// ============================================================

export function showGTToast(msg, tipo = 'erro') {
  const cores  = { erro: '#c62828', sucesso: '#2e7d32', aviso: '#e65100', info: '#1565c0' };
  const emojis = { erro: '❌', sucesso: '✅', aviso: '⚠️', info: 'ℹ️' };
  const cor = cores[tipo] || cores.info;
  const emoji = emojis[tipo] || '';

  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed', 'bottom:90px', 'left:50%', 'transform:translateX(-50%)',
    'background:' + cor, 'color:white',
    'padding:12px 22px', 'border-radius:10px',
    'font-size:13px', 'font-weight:700',
    'z-index:99998', 'max-width:88vw', 'text-align:center',
    'box-shadow:0 4px 20px rgba(0,0,0,0.35)',
    'animation:gtFadeIn 0.2s ease',
    'pointer-events:none'
  ].join(';');
  el.textContent = emoji + ' ' + msg;

  // Animação via style tag (só cria uma vez)
  if (!document.getElementById('gt-toast-style')) {
    const s = document.createElement('style');
    s.id = 'gt-toast-style';
    s.textContent = '@keyframes gtFadeIn{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(s);
  }

  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.4s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, 3500);
}

// ============================================================
// LEDGERLANDS — PROPERTIES (ll_properties)
// ============================================================

async function getLLProperties() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'll_properties'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e) { console.error('Erro getLLProperties:', e); return []; }
}

async function saveLLProperty(data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...rest } = data;
    const now = new Date().toISOString();
    const pid = id || ('PROP' + Date.now());
    await setDoc(doc(db, 'users', userId, 'll_properties', pid), { ...rest, criadoEm: rest.criadoEm || now, atualizadoEm: now });
    _gtNotify('✅ Imóvel salvo!', 'sucesso');
    return pid;
  } catch(e) { console.error('Erro saveLLProperty:', e); _gtNotify('❌ Erro ao salvar imóvel', 'erro'); return null; }
}

async function updateLLProperty(id, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    const ref = doc(db, 'users', userId, 'll_properties', id);
    await setDoc(ref, { ...data, atualizadoEm: new Date().toISOString() }, { merge: true });
    _gtNotify('✅ Imóvel atualizado!', 'sucesso');
    return true;
  } catch(e) { console.error('Erro updateLLProperty:', e); _gtNotify('❌ Erro ao atualizar imóvel', 'erro'); return false; }
}

async function deleteLLProperty(id) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await deleteDoc(doc(db, 'users', userId, 'll_properties', id));
    _gtNotify('🗑️ Imóvel removido', 'aviso');
    return true;
  } catch(e) { console.error('Erro deleteLLProperty:', e); return false; }
}

// ============================================================
// LEDGERLANDS — BUYERS (ll_buyers)
// ============================================================

async function getLLBuyers() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'll_buyers'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e) { console.error('Erro getLLBuyers:', e); return []; }
}

async function saveLLBuyer(data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...rest } = data;
    const now = new Date().toISOString();
    const bid = id || ('BUY' + Date.now());
    await setDoc(doc(db, 'users', userId, 'll_buyers', bid), { ...rest, criadoEm: rest.criadoEm || now, atualizadoEm: now });
    _gtNotify('✅ Comprador salvo!', 'sucesso');
    return bid;
  } catch(e) { console.error('Erro saveLLBuyer:', e); _gtNotify('❌ Erro ao salvar comprador', 'erro'); return null; }
}

async function updateLLBuyer(id, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    const ref = doc(db, 'users', userId, 'll_buyers', id);
    await setDoc(ref, { ...data, atualizadoEm: new Date().toISOString() }, { merge: true });
    _gtNotify('✅ Comprador atualizado!', 'sucesso');
    return true;
  } catch(e) { console.error('Erro updateLLBuyer:', e); _gtNotify('❌ Erro ao atualizar comprador', 'erro'); return false; }
}

async function deleteLLBuyer(id) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await deleteDoc(doc(db, 'users', userId, 'll_buyers', id));
    _gtNotify('🗑️ Comprador removido', 'aviso');
    return true;
  } catch(e) { console.error('Erro deleteLLBuyer:', e); return false; }
}

// ============================================================
// LEDGERLANDS — CONTRACTS (ll_contracts)
// ============================================================

async function getLLContracts() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'll_contracts'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e) { console.error('Erro getLLContracts:', e); return []; }
}

async function saveLLContract(data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...rest } = data;
    const now = new Date().toISOString();
    const cid = id || ('CON' + Date.now());
    await setDoc(doc(db, 'users', userId, 'll_contracts', cid), { ...rest, criadoEm: rest.criadoEm || now, atualizadoEm: now });
    _gtNotify('✅ Contrato salvo!', 'sucesso');
    return cid;
  } catch(e) { console.error('Erro saveLLContract:', e); _gtNotify('❌ Erro ao salvar contrato', 'erro'); return null; }
}

async function updateLLContract(id, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    const ref = doc(db, 'users', userId, 'll_contracts', id);
    await setDoc(ref, { ...data, atualizadoEm: new Date().toISOString() }, { merge: true });
    _gtNotify('✅ Contrato atualizado!', 'sucesso');
    return true;
  } catch(e) { console.error('Erro updateLLContract:', e); _gtNotify('❌ Erro ao atualizar contrato', 'erro'); return false; }
}

async function deleteLLContract(id) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await deleteDoc(doc(db, 'users', userId, 'll_contracts', id));
    _gtNotify('🗑️ Contrato removido', 'aviso');
    return true;
  } catch(e) { console.error('Erro deleteLLContract:', e); return false; }
}

// ============================================================
// LEDGERLANDS — PAYMENTS (ll_payments)
// ============================================================

async function getLLPayments() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'll_payments'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e) { console.error('Erro getLLPayments:', e); return []; }
}

async function saveLLPayment(data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...rest } = data;
    const now = new Date().toISOString();
    const pid = id || ('PAY' + Date.now());
    await setDoc(doc(db, 'users', userId, 'll_payments', pid), { ...rest, criadoEm: rest.criadoEm || now });
    _gtNotify('✅ Pagamento registrado!', 'sucesso');
    return pid;
  } catch(e) { console.error('Erro saveLLPayment:', e); _gtNotify('❌ Erro ao salvar pagamento', 'erro'); return null; }
}

async function updateLLPayment(id, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    const ref = doc(db, 'users', userId, 'll_payments', id);
    await setDoc(ref, data, { merge: true });
    _gtNotify('✅ Pagamento atualizado!', 'sucesso');
    return true;
  } catch(e) { console.error('Erro updateLLPayment:', e); return false; }
}

async function deleteLLPayment(id) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    await deleteDoc(doc(db, 'users', userId, 'll_payments', id));
    _gtNotify('🗑️ Pagamento removido', 'aviso');
    return true;
  } catch(e) { console.error('Erro deleteLLPayment:', e); return false; }
}

// ============================================================
// LEDGERLANDS — INSTALLMENTS (ll_installments)
// ============================================================

async function getLLInstallments() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const snap = await getDocs(collection(db, 'users', userId, 'll_installments'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e) { console.error('Erro getLLInstallments:', e); return []; }
}

async function saveLLInstallment(data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    const { id, ...rest } = data;
    const iid = id || ('INS' + Date.now() + Math.random().toString(36).slice(2,6));
    await setDoc(doc(db, 'users', userId, 'll_installments', iid), { ...rest, criadoEm: rest.criadoEm || new Date().toISOString() });
    return iid;
  } catch(e) { console.error('Erro saveLLInstallment:', e); return null; }
}

async function updateLLInstallment(id, data) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    const ref = doc(db, 'users', userId, 'll_installments', id);
    await setDoc(ref, data, { merge: true });
    return true;
  } catch(e) { console.error('Erro updateLLInstallment:', e); return false; }
}

async function deleteLLInstallmentsByContract(contractId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    const snap = await getDocs(collection(db, 'users', userId, 'll_installments'));
    const toDelete = snap.docs.filter(d => d.data().contractId === contractId);
    await Promise.all(toDelete.map(d => deleteDoc(d.ref)));
    return true;
  } catch(e) { console.error('Erro deleteLLInstallmentsByContract:', e); return false; }
}

// ============================================================

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
  updateContract,
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
  saveDefiPool, updateDefiPool, deleteDefiPool,
  getDefiBorrows,
  saveDefiBorrow, updateDefiBorrow, deleteDefiBorrow,
  getDefiPositions,
  saveDefiPosition,
  updateDefiPosition,
  deleteDefiPosition,
  getUserSetting,
  saveUserSetting,
  // Ledgerlands
  getLLBuyers, saveLLBuyer, updateLLBuyer, deleteLLBuyer,
  getLLProperties, saveLLProperty, updateLLProperty, deleteLLProperty,
  getLLContracts, saveLLContract, updateLLContract, deleteLLContract,
  getLLPayments, saveLLPayment, updateLLPayment, deleteLLPayment,
  getLLInstallments, saveLLInstallment, updateLLInstallment, deleteLLInstallmentsByContract
};