import { ThemeProvider, CssBaseline, Container, Box, Typography, Button } from '@mui/material';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography variant="h1">Test App</Typography>
          <Typography variant="body1">Si ves esto, MUI está funcionando correctamente</Typography>
          <Button variant="contained">Test Button</Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
