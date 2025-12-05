import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          bgcolor: 'rgba(59, 130, 246, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(59, 130, 246, 0.2)',
          },
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}
