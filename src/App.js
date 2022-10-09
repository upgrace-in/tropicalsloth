import $ from 'jquery'
import { useEffect, useState } from 'react';
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
window.Buffer = window.Buffer || require("buffer").Buffer

function App() {

  const [total_Price, set_total_Price] = useState(0)
  const [mint_count, set_mint_count] = useState(1)

  const [mint_cost, set_mint_cost] = useState(0.55)
  const [max_count, set_max_count] = useState(2)

  function increase() {
    if (mint_count + 1 !== max_count + 1) {
      set_mint_count(mint_count + 1)
    }
  }

  function decrease() {
    if (mint_count - 1 !== 0) {
      set_mint_count(mint_count - 1)
    }
  }

  // Merkle tree integration
  let proof
  const whitelistAddresses = [
    "0x04c63D8c2fc9DD602aeE46F12083af1DdE69C713",
    "0x2caF424F1BcbEf1f1D7dF082c6b5677f0283f9d7",
    "0x17AeCDc3FeD98beAc7629C78849c4444a0a2075b",
    "0x1f9E9d8420387D6B8e74d71468Ae17b693ec537f"
  ]

  const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

  // Get the RootHash
  // const rootHash = merkleTree.getRoot().toString('hex');
  // console.log(rootHash)

  useEffect(() => {
    let mintcost_intern = setInterval(() => {
      let mintCost = parseInt($('#mintCost').text())
      if (mintCost !== 0) {
        set_mint_cost(mintCost)
        clearInterval(mintcost_intern)
      }
    }, 1000)

    let maxcount_intern = setInterval(() => {
      let maxCount = parseInt($('#max_count').text())
      if (maxCount !== 0) {
        set_max_count(maxCount)
        clearInterval(maxcount_intern)
      }
    }, 1000)
  }, [])

  useEffect(() => {
    set_total_Price(mint_count * mint_cost)
  }, [mint_count]);

  useEffect(() => {
    $('#WLmintBtn').click(() => {
      const claimingAddress = $('#user_address').text()
      for (var i = 0; i < whitelistAddresses.length; i++) {
        if (claimingAddress === whitelistAddresses[i]) {
          const hexProof = merkleTree.getHexProof(leafNodes[i])
          proof = hexProof.toString()
          break
        } else {
          proof = null
        }
      }
      if (proof == null) {
        alert("You are not whitelisted!");
      } else {
        $('#hash_proof').html(proof)
        $('#WLmintBtn').off()
      }
    })
  }, [])

  return (
    <div className="App text-center mx-auto">
      <div className="elementor-element elementor-element-926a501 elementor-position-top elementor-vertical-align-top exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-image-box"
        data-id="926a501" data-element_type="widget"
        data-widget_type="image-box.default">
        <div className="elementor-widget-container">
          <div className="elementor-image-box-wrapper">
            <style>
            </style>
            <div className="elementor-image-box-content">
              <div className="mint-box2 mintbox">
                <button onClick={() => decrease()}
                  className="mytbns wht text-center">-</button>
                <h4 id="mint_count"
                  className="mintcount text-center elementor-image-box-title">{mint_count}</h4>
                <button onClick={() => increase()}
                  className="mytbns wht text-center">+</button>
              </div>

              <span className="hidden" id="user_address"></span>
              <span className="hidden" id="hash_proof"></span>

              <button id="WLmintBtn"
                className="hidden wht text-center"
                type="button">Mint</button>
              <button id="publicMintBtn"
                className="hidden wht text-center"
                type="button">Mint</button>
              <button id="connect_btn" className="wht text-center"
                type="button">Connect
                Wallet</button>
            </div>
          </div>
        </div>
      </div>
      <div className="elementor-element elementor-element-ad36ec5 elementor-widget-divider--view-line exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-divider"
        data-id="ad36ec5" data-element_type="widget"
        data-widget_type="divider.default">
        <div className="elementor-widget-container">
          <div className="elementor-divider">
            <span className="elementor-divider-separator">
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto text-center">
        <h3 className="wl">Pay with credit card</h3>
        <CrossmintPayButton
          style={{ display: 'none' }}
          id="crossmintBTN"
          clientId="4a230a92-4d32-431b-8f18-b4e10def1a97"
          mintConfig={{ "type": "erc-721", "totalPrice": `${total_Price}`, "_mintAmount": `${mint_count}` }}
          environment="staging"
        />
        <div id="pay-credit-card" className='row text-center mx-auto'>
          <div className='col-md-9'>
            <div className="form-group">
              <input className="form-control fc" id="usersAddress" type="email"
                placeholder='Enter your crossmint email ID...' />
            </div>
          </div>
          <div className='col-md-3'>
            <button className="wl" type="button" id="checkAddress">Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
