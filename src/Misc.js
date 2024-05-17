import { useState, useEffect } from 'react'
import './index.css'
import { saveItem, refreshItems, removeItem, getDateDB, saveWishItem, refreshWishItems } from './envelopeDB'
import { CssBaseline, ThemeProvider, createTheme, Container, Card, CardContent, Typography, TextField, Button, List, ListItem, Box, ListItemText, Grid } from '@mui/material';
import { Delete as DeleteIcon, AddCircle as AddCircleIcon, RemoveCircle as RemoveCircleIcon } from '@mui/icons-material';

const Misc = () => {
  const [totalAmount, setTotalAmount] = useState(0)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([])
  const [date, setDate] = useState('')
  const [wishItem, setWishItem] = useState('')
  const [wishItems, setWishItems] = useState([])

  useEffect(() => {
    refreshItems(updateTotalAmount)
  }, [totalAmount])

  useEffect(() => {
    getDateDB(setDate)
    refreshWishItems(setWishItems)
  }, [])

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

  function handleWishItem() {
    saveWishItem(wishItem)
    setWishItem('')
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
              {date}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: '10px' }}>
          <CardContent className='transactionCard'>
            <Grid container alignItems="center">
              <Grid item xs={9}>
                <Grid container direction="column">
                  <TextField
                    fullWidth
                    type="text"
                    name="formDescription"
                    label="Transaction Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    type="number"
                    name="amount"
                    label="Transaction Amount"
                    variant="outlined"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Grid container direction="column" alignItems="flex-end">
                  <Button onClick={() => handleSubmit('add')} sx={{ marginBottom: 3 }}>
                    <AddCircleIcon />
                  </Button>
                  <Button onClick={() => handleSubmit('subtract')}><RemoveCircleIcon /></Button>

                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardContent className='transactionCard'>
            <List>
              {items.length > 0 && items.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText>
                    {item.description} {item.operation} ${item.amount}
                  </ListItemText>
                  <Button onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card sx={{ marginTop: '20px' }}>
          <CardContent className='wishListCard'>
            <Box display="flex" alignItems="center">
              <TextField
                type="text"
                name="formDescription"
                label="Desired Item"
                variant="outlined"
                value={wishItem}
                onChange={(e) => setWishItem(e.target.value)}
                margin="normal"
                fullWidth
              />
              <Button onClick={() => handleWishItem()} sx={{ marginLeft: 1 }}>
                <AddCircleIcon />
              </Button>
            </Box>

          </CardContent>

          <CardContent className='wishListCard'>
            <List>
              {wishItems.length > 0 && wishItems.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText>
                    {item.value}
                  </ListItemText>
                  {/* <Button onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button> */}
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider >
  )
}

export default Misc
