import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AiFillFire, AiFillHeart } from 'react-icons/ai';
import { MdVerified, MdTimer } from 'react-icons/md';
import { TbArrowBigLeftLines, TbArrowBigRightLine } from 'react-icons/tb';

import Style from './BigNFTSilder.module.css';
import images from '../../img';
import Button from '../Button/Button';

const BigNFTSilder = () => {

    const [idNumber, setIdNumber] = useState(0);

    const sliderData = [
        {
            title: "First",
            id: 1,
            name: "Name",
            collection: "GYm",
            price: "00000064664 ETH",
            like: 243,
            image: images.user1,
            nftImage: images.nft_image_1,
            time:{
                days: 27,
                hours: 10,
                minutes: 11,
                seconds: 35
            },
        },
        {
            title: "Second",
            id: 2,
            name: "Name_2",
            collection: "GYm",
            price: "00000064664 ETH",
            like: 213,
            image: images.user2,
            nftImage: images.nft_image_2,
            time:{
                days: 27,
                hours: 10,
                minutes: 11,
                seconds: 35
            },
        },
        {
            title: "Third",
            id: 3,
            name: "Name_3",
            collection: "GYm",
            price: "00000064664 ETH",
            like: 288,
            image: images.user3,
            nftImage: images.nft_image_3,
            time:{
                days: 27,
                hours: 10,
                minutes: 11,
                seconds: 35
            },
        },
        {
            title: "Fourth",
            id: 4,
            name: "Name_4",
            collection: "GYm",
            price: "00000064664 ETH",
            like: 210,
            image: images.user4,
            nftImage: images.nft_image_4,
            time:{
                days: 27,
                hours: 10,
                minutes: 11,
                seconds: 35
            },
        }
    ];

    // Increase Number
    const inc = useCallback(() => {
        if(idNumber + 1 < sliderData.length){
            setIdNumber(idNumber + 1);
        }
    }, [idNumber, sliderData.length]);

    // decrease number
    const dec = useCallback(() => {
        if(idNumber > 0){
            setIdNumber(idNumber - 1);
        }
    }, [idNumber]);

    // useEffect(() => {
    //     inc();
    // }, []);

    return (
        <div className={Style.bigNFTSlider}>
            <div className={Style.bigNFTSlider_box}>
                <div className={Style.bigNFTSlider_box_left}>
                    <h2>{sliderData[idNumber].title}</h2>
                    <div className={Style.bigNFTSlider_box_left_creator}>
                        <div className={Style.bigNFTSlider_box_left_creator_profile}>
                            <Image
                                className={Style.bigNFTSlider_box_left_creator_profile_img}
                                src={sliderData[idNumber].image}
                                alt="profile image"
                                width={50}
                                height={50}
                            />
                            <div className={Style.bigNFTSlider_box_left_creator_profile_info}>
                                <p>Creator</p>
                                <h4>
                                    {sliderData[idNumber].name}{" "}
                                    <span>
                                        <MdVerified />
                                    </span>
                                </h4>
                            </div>
                        </div>

                        <div className={Style.bigNFTSlider_box_left_creator_collection}>
                            <AiFillFire
                                className={Style.bigNFTSlider_box_left_creator_collection_icon}
                            />

                            <div className={Style.bigNFTSlider_box_left_creator_collection_info}>
                                <p>Collection</p>
                                <h4>{sliderData[idNumber].collection}</h4>
                            </div>
                        </div>
                    </div>

                <div className={Style.bigNFTSlider_box_left_bidding}>
                    <div className={Style.bigNFTSlider_box_left_bidding_box}>
                        <small>Current Bid</small>
                        <p>
                            {sliderData[idNumber].price} <span>$221,21</span>
                        </p>
                    </div>

                    <p className={Style.bigNFTSlider_box_left_bidding_box_auction}>
                        <MdTimer className={Style.bigNFTSlider_box_left_bidding_box_icon} />
                        <span>Auction ending in</span>
                    </p>

                    <div className={Style.bigNFTSlider_box_left_bidding_box_timer}>
                        <div className={Style.bigNFTSlider_box_left_bidding_box_timer_item}>
                            <p>{sliderData[idNumber].time.days}</p>
                            <span>Days</span>
                        </div>

                    <div className={Style.bigNFTSlider_box_left_bidding_box_timer_item}>
                        <p>{sliderData[idNumber].time.hours}</p>
                        <span>Hours</span>
                    </div>

                    <div className={Style.bigNFTSlider_box_left_bidding_box_timer_item}>
                        <p>{sliderData[idNumber].time.minutes}</p>
                        <span>mins</span>
                    </div>

                    <div className={Style.bigNFTSlider_box_left_bidding_box_timer_item}>
                        <p>{sliderData[idNumber].time.seconds}</p>
                        <span>secs</span>
                    </div>
                </div>

                <div className={Style.bigNFTSlider_box_left_button}>
                    <Button btnName="Place" handleClick={() => {}} />
                    <Button btnName="View" handleClick={() => {}} />
                </div>
            </div>

            <div className={Style.bigNFTSlider_box_left_sliderBtn}>
                <TbArrowBigLeftLines className={Style.bigNFTSlider_box_left_sliderBtn_icon} onClick={() => dec()} />
                <TbArrowBigRightLine className={Style.bigNFTSlider_box_left_sliderBtn_icon} onClick={() => inc()} />
            </div>
                </div>

                <div className={Style.bigNFTSlider_box_right}>
            <div className={Style.bigNFTSlider_box_right_box}>
                <Image
                    src={sliderData[idNumber].nftImage}
                    alt="NFT IMAGE"
                    className={Style.bigNFTSlider_box_right_box_img}
                />

                <div className={Style.bigNFTSlider_box_right_box_like}>
                    <AiFillHeart />
                    <span>{sliderData[idNumber].like}</span>
                </div>
            </div>
                </div>
            </div>
        </div>
    )
}

export default BigNFTSilder;