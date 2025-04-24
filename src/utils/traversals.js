function getAdjacencyList(nodes, connections){
    const adjList = {}
    nodes.forEach(({ ID }) => {
        adjList[ID] = []
    })

    connections.forEach(({ from, to }) => {
        adjList[from.nodeID].push(to.nodeID)
        adjList[to.nodeID].push(from.nodeID)
    })

    return adjList
}

export function runDFS(nodes, connections, startingNodeID) {
    // Make adjacency list
    const adjList = getAdjacencyList(nodes, connections)

    // Run traversal
    const visited = new Set()
    const result = []

    function dfs(nodeID) {
        if (visited.has(nodeID)) return
        visited.add(nodeID)
        result.push(nodeID)

        for (const neighbor of adjList[nodeID]) {
            dfs(neighbor)
        }
    }

    dfs(startingNodeID)

    console.log('DFS traversal: ', result)
    return result
}