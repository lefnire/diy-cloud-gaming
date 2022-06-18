import create from 'zustand'
import {persist} from "zustand/middleware"
import {User, Friend, InstanceForm, Instance} from './schemas'

interface Store {
  authenticated: boolean
  setAuthenticated: (authenticated: boolean) => void

  instances: Instance[]
  setInstances: (instances: Instance[]) => void

  friends: Friend[]
  addFriend: (friend: Friend) => void
  removeFriend: (friend: Friend) => void

  user: User
  setUser: (user: User) => void
}

// const [loggedIn, setLoggedIn] = useState(false)
const useStore = create(persist<Store>(
  (set, get) => ({
    authenticated: false,
    setAuthenticated: (authenticated) => set(state => ({authenticated})),

    user: {
      email: 'x@y.com',
      username: "impiorum"
    },
    setUser: (user: User) => set(state => ({user})),

    instances: [],
    setInstances: (instances) => set({instances}),

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