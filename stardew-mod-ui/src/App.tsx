import * as React from "react"
import {
  ChakraProvider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"

// Libraries
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink
} from "react-router-dom";

// Components
import { EventStudio } from './eventstudio/EventStudio';
import { Home } from './Home';
import { TileMapViewer } from "./mapviewer/MapViewer";

console.dir(process.env)

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router basename="/stardew-mod-ui">
      <div>
        <nav>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/">home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/#/eventstudio">event studio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/#/mapviewer/Town">map viewer</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </nav>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/#/eventstudio" element={<EventStudio/>} />
          <Route path="/#/mapviewer/:mapname" element={<TileMapViewer/>} />
        </Routes>
      </div>
    </Router>
  </ChakraProvider>
)