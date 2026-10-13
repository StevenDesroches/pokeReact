// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

import '@/styles/background.css';

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/lib/i18n/i18n';

import { AppShell, Flex, Button } from '@mantine/core';
import { PokemonsProvider } from '@/contexts/PokemonsContext';

import Pokedex from '@/components/pokemons/pokedex/Pokedex';
import PokeGame from '@/components/pokemons/pokeGame/PokeGame';
import { useState } from 'react';


import LanguageSwitcher from '@/components/language/LanguageSwitcher';

// import PokeTest from './components/PokeTest'
// import SearchBarTest from './components/SearchBarTest'
// import * as pokeApi from './lib/pokeApi/pokemon'



function App() {
  const [selectedPage, setSelectedPage] = useState<String>('Pokedex');
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>

        <MantineProvider>

          <AppShell padding="md" header={{ height: 60 }}>

            <AppShell.Header className="glass-panel">

              <Flex px="xs" h="100%" gap="xs" align="center" justify="flex-start">
                <Button variant="default" radius="xs" onClick={() => { setSelectedPage('Pokedex') }}>Pokedex</Button>
                <Button variant="default" radius="xs" onClick={() => { setSelectedPage('PokeGame') }}>PokeGame</Button>

                <LanguageSwitcher style={{ marginLeft: "auto" }}></LanguageSwitcher>
              </Flex>

                {/* <div style={{ marginLeft: "auto" }}>Logo</div> */}
            </AppShell.Header>

            <AppShell.Main>
              <PokemonsProvider>
                <Pokedex isVisible={(selectedPage == 'Pokedex')}></Pokedex>
                <PokeGame isVisible={(selectedPage == 'PokeGame')}></PokeGame>
              </PokemonsProvider>
            </AppShell.Main>

          </AppShell>




        </MantineProvider >
      </QueryClientProvider>


      {/* <PokeTest /> */}
      {/* <SearchBarTest /> */}
      {/* <div>
          <label>Search</label>
          <input />
          <div></div>
        </div> */}
    </>
  )
}

export default App
