import React, {useContext} from "react"
import Hero from "../home/hero/Hero"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "../home/Home"
import Pricing from "../pricing/Pricing"
import Blog from "../blog/Blog"
import Services from "../services/Services"
import Contact from "../contact/Contact"
import { AppContext } from "../../context/AppContext"
import Header from "../common/header/Header"

const Pages = () => {
  const {currentAccount} = useContext(AppContext)
  return (
    <>
    {currentAccount.length > 0 ? 
      <Router>
        <Switch>
       
          <Route exact path='/' component={Home} />
          <Route exact path='/services' component={Services} />
          <Route exact path='/blog' component={Blog} />
          <Route exact path='/pricing' component={Pricing} />
          <Route exact path='/contact' component={Contact} />
        </Switch>
      </Router> :
      <Hero/>
}
    </>
  )
}

export default Pages
