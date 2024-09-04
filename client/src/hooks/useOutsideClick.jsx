import { useEffect } from 'react';

const useOutsideClick = (ref, callback, triggerRef) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Eğer tıklama profil resmine yapılmışsa callback'i tetikle
      if (triggerRef.current && triggerRef.current.contains(event.target)) {
        return;
      }
      // Eğer tıklama menü dışına yapılmışsa menüyü kapat
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, triggerRef]);
};

export default useOutsideClick;