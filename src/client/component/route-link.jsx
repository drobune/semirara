import React, {PropTypes} from 'react'
import {buildPath, validateRoute} from "../../share/route"

export default function RouteLink({action, route, children}){
  if (validateRoute(route).invalid) throw new Error('invalid route', route)
  function onClick(e){
    e.preventDefault()
    action.route(route)
  }
  return (
    <a href={buildPath(route)} onClick={onClick}>{children}</a>
  )
}

RouteLink.propTypes = {
  action: PropTypes.object,
  route: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
}
