import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import './Dashboard.css'
import UserData from './UserData'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const Dashboard = () => {
    const web3 = new Web3(window.ethereum)

    const [userAddress, setUserAddress] = useState<string>()
    const [userBalance, setUserBalance] = useState<string>('')
    const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false)
    const [transferTx, setTransferTx] = useState()

    const updateBalance = async (address: string) => {
        const balanceInWei = await web3.eth.getBalance(address)
        const balance = web3.utils.fromWei(balanceInWei, 'ether')
        setUserBalance(balance)
    }

    const handleConnect = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts: Array<string> = await window.ethereum.request({ method: 'eth_requestAccounts' })
                const address: string = accounts[0]

                await updateBalance(address)

                handleNetworkChange()

                setUserAddress(address)
            } catch (error) {
                console.error('Error connecting the wallet:', error)
            }
        } else console.error('MetaMask is not installed.')
    }

    const handleNetworkChange = async () => {
        const networkId = await web3.eth.net.getId()
        setIsCorrectNetwork(networkId === 97)
        if (!isCorrectNetwork) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x61' }],
                })
            } catch (error) {
                console.error('Error when switching networks.', error)
            }
        }
    }

    window.ethereum.on('chainChanged', () => { if (!isCorrectNetwork) handleNetworkChange() })

    useEffect(() => {
      (async () => {
        if (userAddress) updateBalance(userAddress)
    })()
    }, [userAddress, transferTx])
    

    return (
        <Card>
            <CardContent className="card">
                <Avatar sx={{ width: 56, height: 56 }}>JD</Avatar>
                <div>
                    JOHNDOE
                    <br />
                    <Typography sx={{ color: "#0078FF" }}>john.doe@litlabgames.com</Typography>
                </div>

                {(!userAddress || !isCorrectNetwork)
                    ? <Button size="large" variant="contained" sx={{ marginTop: "14px" }} onClick={handleConnect}>CONNECT</Button>
                    : <UserData userAddress={userAddress} userBalance={userBalance} setTransferTx={setTransferTx} />
                }
            </CardContent>
        </Card>
    );
}

export default Dashboard