import create from 'zustand'
import {persist} from "zustand/middleware"
import {User, Friend, InstanceForm, Instance} from '../../../common/schemas'

interface Store {
  authenticating: boolean
  authenticated: boolean
  setAuthenticating: (authenticating: boolean) => void
  setAuthenticated: (authenticated: boolean) => void

  instances: Instance[]
  addInstance: (instance: InstanceForm) => void

  friends: Friend[]
  addFriend: (friend: Friend) => void
  removeFriend: (friend: Friend) => void

  user: User
  setUser: (user: User) => void
}

// const [loggedIn, setLoggedIn] = useState(false)
const useStore = create(persist<Store>(
  (set, get) => ({
    authenticating: true,
    authenticated: false,
    setAuthenticating: (authenticating) => set(state => ({authenticating})),
    setAuthenticated: (authenticated) => set(state => ({authenticated})),

    user: {
      email: 'x@y.com',
      username: "impiorum"
    },
    setUser: (user: User) => set(state => ({user})),

    instances: [
      {
        instanceId: '666',
        instanceType: 'g5.2xlarge',
        storage: 512,
        spot: true,
        region: 'us-west-2',
        createdAt: Date.now()
      },
      {
        instanceId: '420',
        instanceType: 'g5.2xlarge',
        storage: 384,
        spot: true,
        region: 'us-east-1',
        createdAt: Date.now()
      },
    ],
    addInstance: (instance) => set(state => ({
      // instances: [...state.instances, instance]
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