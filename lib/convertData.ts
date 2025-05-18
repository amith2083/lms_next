export interface MongoDocument {
  _id: { toString: () => string };
  [key: string]: any;
}

export interface DocumentWithId {
  id: string;
  [key: string]: any;
}

export const replaceMongoIdInArray = (array: MongoDocument[]): DocumentWithId[] => {
  const mappedArray = array
    .map(item => ({
      id: item._id.toString(), // Convert ObjectId to string  and add into new field id
      ...item, // Copy all other properties
    }))
    .map(({ _id, ...rest }) => rest); // Remove _id property using destructuring

  return mappedArray;
};

export const replaceMongoIdInObject = (obj: MongoDocument): DocumentWithId => {
  const { _id, ...updatedObj } = { ...obj, id: obj._id.toString() }; 
  return updatedObj;
};



