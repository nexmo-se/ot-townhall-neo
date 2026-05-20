// Firestore removed — using in-memory storage
class Firestore{
  static init(): void{}
  static getInstance(): any{ return null; }
}
export default Firestore;