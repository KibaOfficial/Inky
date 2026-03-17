// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { InkyPlayer } from './InkyPlayer'
// import { defaultTheme } from './core/UI/theme'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <InkyPlayer 
      scriptPath="/inks/demo-school-day.inky"
      assetBasePath="/assets"
      // theme={defaultTheme} // Optional custom theme
      autoStart={true}
    />
  </React.StrictMode>,
)
