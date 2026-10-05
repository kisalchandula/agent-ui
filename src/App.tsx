import { useEffect, useState } from "react"

import Header from "./components/Header"
import BuildingView from "./components/BuildingView"
import AgentPanel from "./components/AgentPannel"
import CommandPanel from "./components/CommandPanel"
import ActivityPanel from "./components/ActivityPanel"
import Footer from "./components/Footer"

type Location = {
  name: string
  type: string
  x: number
  y: number
  floor: number
}

type Connection = {
  from: string
  to: string
  type: string
}

type Agent = {
  location: string
  status: string
  moving: boolean
}


function App() {
  const [locations, setLocations] = useState<Location[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [worldLoading, setWorldLoading] = useState(true)
  const [agent, setAgent] = useState<Agent>({
    location: "Room D",
    status: "Idle",
    moving: false,
  })

  const [route, setRoute] = useState([
    "Room D",
    "Room C",
    "Corridor",
    "Room A",
  ])

  const [command, setCommand] = useState("")

  useEffect(() => {
    const loadWorld = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/world"
        )

        if (!response.ok) {
          throw new Error("Failed to load world")
        }

        const data = await response.json()

        setLocations(data.locations)

        const worldConnections: Connection[] = []

        for (const [from, connections] of Object.entries(
          data.connections
        )) {
          for (const connection of connections as {
            location: string
            type: string
          }[]) {
            worldConnections.push({
              from,
              to: connection.location,
              type: connection.type,
            })
          }
        }

        setConnections(worldConnections)

        const agentResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/agent"
        )

        if (!agentResponse.ok) {
          throw new Error("Failed to load agent")
        }

        const agentData = await agentResponse.json()

        setAgent({
          location: agentData.location,
          status: "Idle",
          moving: false,
        })

        setWorldLoading(false)
      } catch (error) {
        console.error(error)
        setWorldLoading(false)
      }
    }

    loadWorld()
  }, [])

  const currentLocation = locations.find(
    (location) => location.name === agent.location
  )


  const navigateAgent = async (destination: string) => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/agent/navigate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Navigation request failed")
    }

    return response.json()
  }

  const handleCommand = async () => {
    const destination = command.trim()

    if (!destination) {
      return
    }

    try {
      setAgent((current) => ({
        ...current,
        status: "Planning route...",
        moving: true,
      }))
      const result = await navigateAgent(destination)

      if (!result.success) {
        setAgent((current) => ({
          ...current,
          status: "Navigation failed",
          moving: false,
        }))

        return
      }

      setRoute(result.path)

      for (const location of result.path.slice(1)) {
        setAgent({
          location,
          status: "Moving...",
          moving: true,
        })

        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        )
      }

      setAgent({
        location: result.final_location,
        status: "Idle",
        moving: false,
      })

      setCommand("")
    } catch (error) {
      console.error(error)
    }
  }

  if (worldLoading) {
    return (
      <div className="app">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            color: "#7f8b98",
            background: "#0b0f14",
          }}
        >
          Loading building model...
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />

      <main className="workspace">
        <BuildingView
          locations={locations}
          connections={connections}
          route={route}
          agent={agent}
        />

        <aside className="sidebar">
          <AgentPanel
            agent={agent}
            locations={locations}
          />

          <CommandPanel
            command={command}
            onCommandChange={setCommand}
            onSubmit={handleCommand}
          />

          <ActivityPanel
            agentLocation={agent.location}
          />
        </aside>
      </main>

      <Footer floor={currentLocation?.floor ?? 0} />
    </div>
  )
}

export default App