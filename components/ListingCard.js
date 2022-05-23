import { useMarketplace } from "@thirdweb-dev/react";

const ListingCard = ({ name, description, image, price, id }) => {
  const marketplace = useMarketplace(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS
  );
  const buyAsset = async () => {
    try {
      await marketplace.buyoutListing(id, 1);
      alert("Asset purchased successfully");

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error purchasing asset");
    }
  };

  return (
    <div className="listingCard">
      <div className="listingCard__container">
        <img className="listingCard__image" src={image} />
        <div className="listingCard__innerContainer">
          <div className="listingCard__name">{name}</div>
          <div className="listingCard__description">{description}</div>
          <div>{price / 1e18}</div>
        </div>
      </div>
      <button className="listingCard__button" onClick={buyAsset}>
        Buy now!
      </button>
    </div>
  );
};
export default ListingCard;
