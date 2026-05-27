import { createContext, useContext, useState, useEffect } from 'react';

const ProductStatusContext = createContext(null);

export function ProductStatusProvider({ children }) {
  const [hiddenIds, setHiddenIds] = useState(() => {
    try {
      const stored = localStorage.getItem('alpha_hidden_products');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('alpha_hidden_products', JSON.stringify([...hiddenIds]));
  }, [hiddenIds]);

  const toggleProduct = (id) => {
    setHiddenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isPublished = (id) => !hiddenIds.has(id);

  return (
    <ProductStatusContext.Provider value={{ hiddenIds, toggleProduct, isPublished }}>
      {children}
    </ProductStatusContext.Provider>
  );
}

export const useProductStatus = () => {
  const ctx = useContext(ProductStatusContext);
  if (!ctx) throw new Error('useProductStatus must be used within ProductStatusProvider');
  return ctx;
};
