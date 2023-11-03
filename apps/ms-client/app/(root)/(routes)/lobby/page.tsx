import Empty from '@/components/Empty'
import LobbyScreen from '@/components/lobby'

const Lobby = () => {
  return (
    <>
      <Empty />
      <div className="flex w-full items-center justify-center">
        <LobbyScreen />
      </div>
      <Empty />
    </>
  )
}

export default Lobby
