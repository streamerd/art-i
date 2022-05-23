import {
  useAddress,
  useMarketplace,
  MediaRenderer,
  useSigner,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
//import ListingCard from "../components/ListingCard";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading,
  Text,
  Image,
} from "grommet";
import { Favorite, ShareOption, Vend, Github } from "grommet-icons";
import musiCodeUrls from "../data/musiCodeUrls"

const Listings = () => {
  const sdk = new ThirdwebSDK("rinkeby");
  const WETH_RINKEBY = "0xc778417e063141139fce010982780140aa0cd5ab";

  const [activeListings, setActiveListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [NFTsInCollection, setNFTsInCollection] = useState([]);
  const [codeUrls, setCodeUrls] = useState(musiCodeUrls);

  const [loading, setLoading] = useState(true);
  const address = useAddress();
  const router = useRouter();
  const signer = useSigner();

  const marketplace = useMarketplace(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS
  );
  
  useEffect(() => {
    if (!address) router.replace("/");
  }, [address]);
  
  // useEffect(() => {
    //   getActiveListings();
    // }, []);
    
    // useEffect(() => {
      //   getAllListings();
      // }, []);
      useEffect(() => {
        

      })


  useEffect(() => {
    getNFTsInCollection();
  }, []);

  const getActiveListings = async () => {
    try {
      if (!address) return;
      const listings = await marketplace.getActiveListings();
      console.log(listings);
      setActiveListings(listings);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error fetching active listings");
    }
  };

  const getAllListings = async () => {
    try {
      if (!address) return;
      const listings = await marketplace.getAllListings();
      console.log(listings);
      setAllListings(listings);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error fetching all collection");
    }
  };

  const listArtwork = async () => {
    console.log("@ listArtwork func. ");
    const listing = {
      // address of the NFT contract the asset you want to list is on
      assetContractAddress: "0xD93bEC957B531Ce2Ea6b86F0132ed8a8ae4ad533",
      // token ID of the asset you want to list
      tokenId: "0",
      // when should the listing open up for offers
      startTimestamp: new Date(),
      // how long the listing will be open for
      listingDurationInSeconds: 86400,
      // how many of the asset you want to list
      quantity: 1,
      // address of the currency contract that will be used to pay for the listing
      currencyContractAddress: WETH_RINKEBY,
      // how much the asset will be sold for
      buyoutPricePerToken: "0.4",
    };

    console.log(`here's artwork's listing details: ${JSON.stringify(listing)}`);

    try {
      const contract = sdk.getMarketplace(
        "0x93bFDdcAC61259831e5Fd5362b49dd35d16eFd18"
      );
      const tx = await contract.direct.createListing(listing);
      signer.signMessage(tx);
      const receipt = tx.receipt; // the transaction receipt
      const id = receipt.id;

      console.log(`transaction id:  ${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const getNFTsInCollection = async () => {
    try {
      // if (!address) return;
      console.log("running getNFTCollection ");
      const contract = sdk.getNFTCollection(
        "0xD93bEC957B531Ce2Ea6b86F0132ed8a8ae4ad533"
      );
      const NFTs = await contract.getAll();
      console.log(`number of NFTs @ collection: ${NFTs.length}`);
      setNFTsInCollection(NFTs);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error fetching NFTS @ collection");
    }
  };

  // const newListing = async () => {
  //   try{

  //     if(!address) return;

  //   } catch (err) {
  //     console.error(err);
  //     alert("Error listing this NFT");
  //   }

  //   }
  // }

  return (
    <div className="listing">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Box background={"black"} direction="row">
            <Box width={"20%"}>
              <Heading size="medium" textAlign="center" margin={"22px"}>
                music
              </Heading>
            </Box>
            <Box background={"pink"} width="60%" align="center">
              <Text
                color={"black"}
                weight="bolder"
                size="large"
                margin={"40px"}
              >
                something unique, something real
              </Text>
            </Box>
            <Box background={"yellow"} align="end" pad="large" width={"20%"}>
              <Text color={"red"} weight="bolder">
                {address.substring(0, 4)} ...{" "}
                {address.substring(address.length - 4, address.length - 1)}
              </Text>
            </Box>
          </Box>

          {NFTsInCollection.length > 0 ? (
            <Box background={"black"} height="xlarge" direction="row">
              {NFTsInCollection.map((NFT, index) => (
                <Card
                  key={NFTsInCollection[index].metadata.name}
                  height="40%"
                  width="medium"
                  background="light-1"
                  margin={"40px"}
                >
                  <CardHeader pad="medium" background={"orange"}>
                    {NFT.metadata.name}
                  </CardHeader>
                  <CardBody pad="medium">
                    <Box direction="column">
                      <Image
                        src={NFT.metadata.image}
                        width="100%"
                        height={"100%"}
                      />
                      <MediaRenderer
                        src={NFT.metadata.animation_url}
                        alt={NFT.metadata.name}
                      />
                    </Box>
                  </CardBody>
                  <CardFooter
                    pad={{ horizontal: "small" }}
                    background="light-2"
                  >
                    <Button icon={<Favorite color="red" />} hoverIndicator />
                    {/* <Button olor={"purple"} onClick={listArtwork}>
                      <Text weight={"bolder"}>list artwork (wip) </Text>
                    </Button> */}
                    <Button
                      icon={<Github color="plain" />}
                      hoverIndicator
                      href={musiCodeUrls[index]}
                      target="_blank"
                    />
                  </CardFooter>
                </Card>
              ))}
            </Box>
          ) : (
            <>
              <div className="listings__none">
                Nothing in your collection rn
              </div>
              {/* <button onClick={newListing}>new listing</button> */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// const getReadMore = (txt) => {
//   return txt.substring(0, 140);
// };

export default Listings;
