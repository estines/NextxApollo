export const photoResolver = {
    Query: {
        list(root,args,context) {
            return [1,2,3,4]
        }
    },
    Mutation: {
        add(root,args) {
            return []
        }
    }
}