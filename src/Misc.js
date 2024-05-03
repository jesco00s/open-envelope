import { useState, useEffect } from 'react'
import './index.css'
import { saveItem, refreshItems, removeItem } from './envelopeDB'
import { CssBaseline, ThemeProvider, createTheme, Container, Card, CardContent, Typography, TextField, Button, List, ListItem, Box, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Misc = () => {
  const [totalAmount, setTotalAmount] = useState(0)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    refreshItems(updateTotalAmount)
  }, [totalAmount])

  function updateTotalAmount(items) {
    setItems(items)
    let newTotal = 0
    items.forEach((item) => {
      const amount = parseFloat(item.amount)
      const isAddition = item.operation.includes('+')
      newTotal = isAddition ? newTotal + amount : newTotal - amount
    })
    setTotalAmount(newTotal)
  }

  function handleSubmit(actionType) {
    const amountValue = parseFloat(amount)
    if (isNaN(amountValue)) {
      console.log('Please enter a valid number')
      return
    }

    let symbol = actionType === 'add' ? '+' : '-'
    const newTotal =
      actionType === 'add'
        ? totalAmount + amountValue
        : totalAmount - amountValue
    setTotalAmount(newTotal)

    const item = {
      description: description,
      operation: symbol,
      amount: amountValue,
    }
    saveItem(item)
    setAmount('')
    setDescription('')
  }

  const handleRemoveItem = (index) => {
    const itemToRemove = items[index]
    removeItem(itemToRemove.id)
      .then(() => {
        const filteredItems = items.filter((item, idx) => idx !== index)
        updateTotalAmount(filteredItems)
      })
      .catch((error) => {
        console.error('Failed to remove item:', error)
      })
  }

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xs" sx={{ padding: '20px' }}>
        <Card sx={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h4" align="center">Misc: ${totalAmount}</Typography>
            <Typography variant="subtitle1" align="center" style={{ paddingTop: '10px' }}>
              01/01/2024 - 01/01/2024
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: '10px' }}>
          <CardContent>
            <TextField
              fullWidth
              type="text"
              name="formDescription"
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              name="amount"
              label="Amount"
              variant="outlined"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="normal"
            />

            <Box display="flex" justifyContent="center" alignItems="center">
              <Button onClick={() => handleSubmit('add')} style={{ marginRight: '10px' }}>
                Add
              </Button>
              <Button onClick={() => handleSubmit('subtract')}>Subtract</Button>
            </Box>
          </CardContent>
        </Card>
        <List
        >
          {items.length > 0 && items.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemText>
                {item.description} {item.operation} ${item.amount}
              </ListItemText>
              <Button onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button>
            </ListItem>
          ))}
        </List>
      </Container>
    </ThemeProvider>
  )
}

export default Misc
