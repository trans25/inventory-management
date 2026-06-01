import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Box, Typography, Button, Stack } from '@mui/material'

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Founder&apos;s<Box component="span" sx={{ color: 'primary.main' }}>Box</Box>
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Manage your inventory, orders and team in one place.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button component={Link} to="/dashboard" size="large">
          Go to Dashboard
        </Button>
        <Button component={Link} to="/login" variant="outlined" size="large">
          Login
        </Button>
      </Stack>
    </Container>
  )
}

export default Home
