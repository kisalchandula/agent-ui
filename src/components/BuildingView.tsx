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

type BuildingViewProps = {
  locations: Location[]
  connections: Connection[]
  route: string[]
  agent: Agent
}

function BuildingView({
  locations,
  connections,
  route,
  agent,
}: BuildingViewProps) {
  const currentLocation = locations.find(
    (location) => location.name === agent.location
  )

  return (
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
  )
}

export default BuildingView