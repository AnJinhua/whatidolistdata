//function that filters conversations duplicates with same id
export const filterDuplicatesById = (arr, id) => {
  return arr.filter((item) => item._id !== id);
};

//function that filters conversations duplicates with same slug
export const filterDuplicatesBySlug = (arr, slug) => {
  return arr.filter((item) => item.slug !== slug);
};
//function that filters conversations duplicates with same conversationID
export const filterDuplicatesByCiD = (arr, conversationId) => {
  return arr.filter((item) => item.conversationId !== conversationId);
};

//function that filters conversations duplicates with same conversationID
export const filterDuplicatesByMessageID = (arr, messageId) => {
  return arr.filter((item) => item.messageId !== messageId);
};

//function that filters conversations duplicates with same conversationID
export const filterDuplicatesByMiD = (arr, mediaId) => {
  return arr.filter((item) => item.mediaId !== mediaId);
};

//function that filters conversations duplicates with same conversationID
export const filterDuplicatesBySiD = (arr, storyId) => {
  return arr.filter((item) => item.storyId !== storyId);
};

//function that filters conversations duplicates with same id
export const reduceDuplicateArray = (arr) =>
  arr.reduce((acc, curr) => {
    if (!acc.find((m) => m._id === curr._id)) {
      acc.push(curr);
    }
    return acc;
  }, []);

//function that takes a single array of arrays and returns a single array
export const flattenArray = (arr) => {
  return arr.reduce((acc, curr) => {
    return [...acc, ...curr];
  }, []);
};
