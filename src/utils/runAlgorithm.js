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

// BUG: DFS does not traverse to its neighbor with the min node id.
function runDFS(nodes, connections, startingNodeID, endingNodeID) {
    // Make adjacency list
    const adjList = getAdjacencyList(nodes, connections)

    // Run traversal
    const visited = new Set()
    const nodeTraversal = []
    const edgeTraversal = []

    function dfs(nodeID, prevNode) {
        if (visited.has(nodeID)) return
        visited.add(nodeID)
        nodeTraversal.push(nodeID)
        edgeTraversal.push([ prevNode, nodeID ])

        if (endingNodeID && endingNodeID === nodeID) return

        for (const neighbor of adjList[nodeID]) {
            dfs(neighbor, nodeID)
        }
    }

    dfs(startingNodeID, null)

    console.log(`nodes: ${nodeTraversal}\nedges: ${JSON.stringify(edgeTraversal)}`)

    return [nodeTraversal, edgeTraversal]
}

export default function runAlgorithm({
    algorithm,
    nodes,
    connections,
    startID,
    endID,
}) {
    switch (algorithm) {
        case 'DFS':
            return runDFS(nodes, connections, startID, endID)
        default:
            console.warn(`Algorithm "${algorithm}" is not defined.`)
            return []
    }
}