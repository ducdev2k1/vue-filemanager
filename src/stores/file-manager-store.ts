// Refs

export const useFileManagerStore = () => {
  const isModalCreate = ref(false);

  const toggleModalCreate = () => {
    isModalCreate.value = !isModalCreate.value;
  };

  return {
    isModalCreate,

    // Functions
    toggleModalCreate,
  };
};
