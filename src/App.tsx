import { useEffect, useState } from "react"

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
      <header className="header">
        <div>
          <h1>BIM WORLD AGENT</h1>
          <span>Spatial reasoning environment</span>
        </div>

        <div className="status">
          <span className="status-dot" />
          Connected
        </div>
      </header>

      <main className="workspace">
        <section className="building-view">
          <div className="view-header">
            <span>BUILDING VIEW</span>
            <span>Floor {currentLocation?.floor ?? 0}</span>
          </div>

          <div className="building">
            {locations.map((location) => (
              <div
                key={location.name}
                className={`location ${location.type} ${location.name
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {location.name.toUpperCase()}

                {agent.location === location.name && (
                  <span className="agent">●</span>
                )}
              </div>
            ))}

            {connections.map((connection) => (
              <div
                key={`${connection.from}-${connection.to}`}
                className={`door door-${connection.from
                  .toLowerCase()
                  .replace(" ", "-")}`}
              />
            ))}

            {route.slice(0, -1).map((location, index) => {
              const nextLocation = route[index + 1]

              const segment = `${location}-${nextLocation}`

              return (
                <div
                  key={segment}
                  className={`route route-${segment
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                />
              )
            })}
          </div>
        </section>

        <aside className="sidebar">
          <section className="panel">
            <div className="panel-title">AGENT</div>

            <div className="agent-name">
              <div className="avatar">A</div>

              <div>
                <strong>Spatial Agent</strong>
                <span>Autonomous agent</span>
              </div>
            </div>

            <div className="info">
              <div>
                <span>Location</span>
                <strong>{agent.location}</strong>
              </div>

              <div>
                <span>Type</span>
                <strong>
                  {currentLocation?.type ?? "Unknown"}
                </strong>
              </div>

              <div>
                <span>Floor</span>
                <strong>{currentLocation?.floor ?? 0}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{agent.status}</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">COMMAND</div>

            <div className="command">
              <input
                type="text"
                placeholder="Ask the agent..."
                value={command}
                onChange={(event) =>
                  setCommand(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleCommand()
                  }
                }}
              />

              <button onClick={handleCommand}>→</button>
            </div>
          </section>

          <section className="panel activity-panel">
            <div className="panel-title">ACTIVITY</div>

            <div className="activity">
              <div>
                <span className="activity-dot complete" />

                <div>
                  <strong>Agent initialized</strong>
                  <span>{agent.location}</span>
                </div>
              </div>

              <div>
                <span className="activity-dot" />

                <div>
                  <strong>Waiting for command</strong>
                  <span>Ready</span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </main>

      <footer>
        Spatial Agent
        <span>•</span>
        Building Model
        <span>•</span>
        Floor {currentLocation?.floor ?? 0}
      </footer>
    </div>
  )
}

export default App