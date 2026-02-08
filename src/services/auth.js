import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  try {
    // Configurar o provider para forçar seleção de conta
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Erro no login Google:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
    
    // Retornar mensagens de erro mais específicas
    let errorMessage = 'Erro ao fazer login com Google';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Popup fechado. Tente novamente.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup bloqueado. Habilite popups para este site.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'Domínio não autorizado. Configure no Firebase Console.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Login com Google não está habilitado. Ative no Firebase Console.';
    }
    
    return { user: null, error: errorMessage };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
