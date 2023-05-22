import { Route, Routes, useMatch } from 'react-router-dom';
import WmsDetails from './WmsDetails';
import WmsForm from './WmsForm';
import WmsList from './WmsList';
import { Scene } from '../../../core/layout/browser/Scene';
import { wmsPath } from '../wmsModels';
import { useMediaQuery, useTheme } from '@mui/material';

export default function WmsScene() {
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const onlyList = useMatch(wmsPath);

  return (
    <Scene>
      <WmsList
        xs={12}
        md={6}
        lg={4}
        sx={{ display: mdDown && !onlyList ? 'none' : undefined }}
      />
      <Routes>
        <Route path=":id" element={<WmsDetails xs={12} md={6} xl={5} />} />
        <Route path=":id?/form" element={<WmsForm xs={12} md={6} xl={5} />} />
      </Routes>
    </Scene>
  );
}
