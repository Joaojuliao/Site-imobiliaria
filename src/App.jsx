import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToAnchor from './components/layout/ScrollToAnchor';
import Layout from './components/layout/Layout';
import { Loader2 } from 'lucide-react';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'));
const Imoveis = lazy(() => import('./pages/Imoveis'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Financie = lazy(() => import('./pages/Financie'));
const Negocie = lazy(() => import('./pages/Negocie'));
const ImoveisFavoritos = lazy(() => import('./pages/ImoveisFavoritos'));
const PoliticaPrivacidade = lazy(() => import('./pages/PoliticaPrivacidade'));

import { PropertyProvider } from './context/PropertyContext';

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

function App() {
  return (
    <PropertyProvider>
      <Router>
        <ScrollToAnchor />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/imoveis" element={<Imoveis />} />
              <Route path="/imovel/:id" element={<PropertyDetails />} />
              <Route path="/financie" element={<Financie />} />
              <Route path="/negocie" element={<Negocie />} />
              <Route path="/favoritos" element={<ImoveisFavoritos />} />
              <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </PropertyProvider>
  );
}

export default App;