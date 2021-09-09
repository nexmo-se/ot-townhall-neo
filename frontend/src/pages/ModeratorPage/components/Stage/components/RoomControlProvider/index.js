import { RoomControlContext } from "./contexts/room";
import { useConfiguration } from "components/ConfigurationProvider";

function RoomControlProvider ({ children }) {
  const { configuration, updateConfiguration } = useConfiguration();

  /**
   * This will create opposite status. For example, if the status is
   * locked, then it will return open.
   * @returns 
   */
  function toggleStatus () {
    if (configuration.state.status === "locked") {
      return "open"
    } else {
      return "locked"
    }
  }

  /**
   * Update the configuration from the server directly to match the status.
   */
  async function toggleRoom () {
    await updateConfiguration({
      state: {
        status: toggleStatus()
      }
    })
  }

  return (
    <RoomControlContext.Provider
      value={{
        status: configuration.state.status,
        toggleRoom
      }}
    >
      {children}
    </RoomControlContext.Provider>
  )
}

export { useRoom } from "./hooks/room";
export default RoomControlProvider;
