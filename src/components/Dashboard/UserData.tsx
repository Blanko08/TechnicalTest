import React, { useState, ChangeEvent } from 'react'
import Web3 from 'web3'
import './UserData.css'
import Typography from '@mui/material/Typography'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

interface userDataProps {
    userAddress: string
    userBalance: string
    setTransferTx: any
}

const UserData = ({ userAddress, userBalance, setTransferTx }: userDataProps) => {
    const web3 = new Web3(window.ethereum)

    const [addressInput, setAddressInput] = useState('')
    const [amountInput, setAmountInput] = useState('')

    const formatAddress = (address: string): string => {
        const prefix: string = address.slice(0, 6)
        const suffix: string = address.slice(-6)

        return `${prefix}...${suffix}`
    }

    const copyAddress = () => { if (userAddress) navigator.clipboard.writeText(userAddress) }

    const handleCancel = () => {
        setAddressInput('')
        setAmountInput('')
    }

    const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => setAddressInput(event.target.value)

    const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^0-9.]/g, '')
        setAmountInput(value)
    }

    const handleMaxClick = () => setAmountInput(userBalance)

    const handleSendLitt = async (amount: string) => {
        await web3.eth.sendTransaction({
            from: userAddress,
            to: addressInput,
            value: web3.utils.toWei(amount, 'ether'),
        }).then((receipt) => {
            setTransferTx(receipt.transactionHash)
            setAddressInput('')
            setAmountInput('')
        })
    }

    return (
        <>
            <div className="address-info">
                <Typography variant="body2" className="address-text">{formatAddress(userAddress)}</Typography>
                <FileCopyIcon className="copy-icon" onClick={copyAddress} />
            </div>
            
            <div>
                <Typography variant="h6" className="user-balance">{userBalance} <span className="litt-text">LITT</span></Typography>
            </div>

            <div className="card-hr">
                <hr />
            </div>

            <div className="form-title-container">
                <Typography variant="body1" className="send-litt-text" sx={{ fontWeight: "bold" }}>Send LITT</Typography>
                <Typography variant="caption" className="cancel-text" onClick={handleCancel}>Cancel</Typography>
            </div>

            <div className="warning-container">
                <Typography variant="body2">Please be sure that the address you send the <br /> tokens is BEP20 (BNB CHAIN)</Typography>
            </div>

            <div>
                <TextField id="bep20-address" label="BEP20 address" value={addressInput} onChange={handleChangeAddress} variant="outlined" fullWidth inputProps={{ maxLength: 42 }} />
                <br />
                <TextField 
                    id="litt-amount"
                    label="LITT amount"
                    value={amountInput}
                    onChange={handleChangeAmount}
                    variant="outlined"
                    fullWidth
                    inputProps={{ inputMode: 'decimal', pattern: '[0-9]*[.]?[0-9]*' }}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button variant="contained" onClick={handleMaxClick}>MAX</Button>
                          </InputAdornment>
                        )
                    }}
                />
            </div>

            <Button size="large" variant="contained" sx={{ marginTop: "10px" }} onClick={() => handleSendLitt(amountInput)}>SEND LITT</Button>
        </>
    );
}

export default UserData