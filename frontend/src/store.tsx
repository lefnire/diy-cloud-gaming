import create from 'zustand'
import { persist } from "zustand/middleware"

interface User {
  email: string
  username: string
}

interface Friend {
  email: string
  username: string
  online: boolean
  // sharedInstances: Instance[]
}

interface Instance {
  instanceId: string
  instanceType: string // 'g5.2xlarge' | 'g5.xlarge' | 'p2.xlarge'
  storage: string
  spot: boolean
  region: string // 'us-west-2' | 'us-west-1' | 'us-east-1' | 'us-east-2'
  dateCreated: string // Date
}

interface Store {
  loggedIn: boolean
  setLoggedIn: () => void

  instances: Instance[]
  addInstance: (instance: Instance) => void

  friends: Friend[]
  addFriend: (friend: Friend) => void
  removeFriend: (friend: Friend) => void

  user: User
  setUser: (user: User) => void
}

// const [loggedIn, setLoggedIn] = useState(false)
const useStore = create(persist<Store>(
  (set, get) => ({
    loggedIn: false,
    setLoggedIn: () => set(state => {
      return {loggedIn: !state.loggedIn}
    }),

    user: {
      email: 'x@y.com',
      username: "impiorum"
    },
    setUser: (user: User) => set(state => ({user})),

    instances: [
      {
        instanceId: 'abc',
        instanceType: 'g5.2xlarge',
        storage: "512",
        spot: true,
        region: 'us-west-2',
        dateCreated: '2022-05-20'
      },
      {
        instanceId: '123',
        instanceType: 'g5.2xlarge',
        storage: "384",
        spot: true,
        region: 'us-east-1',
        dateCreated: '2022-05-23'
      },
    ],
    addInstance: (instance) => set(state => ({
      instances: [...state.instances, instance]
    })),

    friends: [
      {email: "x@y.com", username: "lefnire", online: true},
      {email: "x@z.com", username: "impiorum", online: false},
    ],
    addFriend: (friend) => set(state => ({})),
    removeFriend: (friend) => set(state => ({})),

  }),
  {
    name: "diy-storage", // unique name
    // getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
  }
))

export default useStore