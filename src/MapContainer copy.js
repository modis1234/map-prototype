import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import mapUtils from './lib_dev/mapUtils';

const MapCompo = styled.div`
    width: 1008px;
    height: 667px;
    background-color: #2e2e2e;
    position: relative;
    background-image: url(/images/map/map_bg.png);
    background-repeat: no-repeat;
    .buttom-box {
        width: 39px;
        height: 39px;
        color: #ffffff;
        background-color: #171717;
        /* opacity: 0.5; */
        font-size: 18px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;

        &:hover {
            cursor: pointer;
            background-color: #000000;
        }
        &.tag-button-box {
            top: 10px;
            left: 10px;
        }
        &.expand-button-box {
            top: 10px;
            left: 959px;
        }
    }
    .map-area {
        width: 85%;
        height: 82%;
        position: absolute;
        /* background-color:#171717; */
        /* opacity: 0.7; */
        left: 103px;
        top: 60px;
        .block {
            position: absolute;
            /* background-color: #fff */
            div {
                position: absolute;
            }
            .worker-icon {
                width: 37px;
                height: 44px;
                top: 43px;
                left: 33px;
                .worker-count-box {
                    position: absolute;
                    top: -24px;
                    left: 22px;
                    background: #171717;
                    color: #fff;
                    width: 22px;
                    height: 22px;
                    text-align: center;
                }
            }
            .vehicle-icon {
                width: 62px;
                height: 52px;
                top: 68px;
                left: 57px;
                .vehicle-count-box {
                    position: absolute;
                    top: -21px;
                    left: 38px;
                    background: #171717;
                    color: #fff;
                    width: 22px;
                    height: 22px;
                    text-align: center;
                }
            }
            .scanner-icon {
                right: 132px;
                top: 0px;
                .scanner-img {
                    background-image: url(/images/map/scanTag.png);
                    background-repeat: no-repeat;
                    width: 13px;
                    height: 13px;
                    top: 16px;
                    left: 14px;
                }
                .scanner-device-box {
                    background-image: url(/images/map/deviceBox.png);
                    background-repeat: no-repeat;
                    width: 13px;
                    height: 18px;
                    top: 28px;
                    left: 16px;
                }
            }
            .cctv-icon {
                top: 0px;
                right: 129px;
                .cctv-img {
                    background-image: url(/images/map/cctvTag.png);
                    background-repeat: no-repeat;
                    width: 13px;
                    height: 13px;
                    top: 6px;
                    left: 37px;
                }
                .cctv-device-box {
                    background-image: url(/images/map/deviceBox.png);
                    background-repeat: no-repeat;
                    width: 13px;
                    height: 18px;
                    top: 17px;
                    left: 36px;
                }
            }
        }
    }
    .entrance-image {
        position: absolute;
        /* &#entrance001 {
            top: 310px;
            left: -10px;
            z-index: 100;
        } */
        &#entrance002 {
            top: -35px;
            left: 586px;
        }
        &#entrance003 {
            top: 387px;
            left: 129px;
            z-index: 100;
        }
        &#entrance004 {
            top: 42px;
            left: 725px;
        }
    }
    .tag-list-box {
        width: 100px;
        height: 105px;
        background-color: #000000;
        border: 1px solid #5e5e5e;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 56px;
        top: 10px;
        ul.tag-list {
            padding-left: 0;
            margin: 0;
            list-style: none;
            width: 65%;
            height: 83px;
            li.list-item {
                margin-bottom: 10px;
                label {
                    margin-left: 5px;
                    color: #ffffff;
                }
                input:hover {
                    cursor: pointer;
                }
            }
        }
    }
`;

const MapContainer = () => {
    const [dig1, setDig1] = useState([]);

    const [first, setFirst] = useState({
        objectId: 1,
        block_length: 100,
        total_length: 1295, // 총 굴진거리
        forward_index: 'loc001', // 정방향 노선 인덱스
        forward_length: 762, // 정방향 굴진거리 (함양 시점 방향)
        forward_dig: 155, // 정방향 진행 굴진거리
        forward_device: {
            cctv: 151, // cctv 설치 위치
            scanner: 5, // 스캐너 설치 위치
        },
        revers_index: 'loc002', // 역방향 노선 인덱스,
        revers_length: 770, // 역방향 굴진거리 (함양 종점 방향)
        revers_dig: 15, // 역방향 진행 굴진거리
        revers_device: {
            cctv: 153, // cctv 설치 위치
            scanner: 0, // 스캐너 설치 위치
        },
        block_amount: 13, // 맵 블록 갯수
        block_image: {
            open: {
                src: 'open.png',
                style: {
                    width: '152px',
                    height: '154px',
                },
            },
            close: {
                src: 'close.png',
                style: {
                    width: '152px',
                    height: '152px',
                    position: 'relative',
                    left: '6px',
                    top: '1px',
                },
            },
            // as:[{length:}]
        },
        is_entry: false, // 진입 지점 유무
        is_shaft: false, // 사갱 지점 유무
    });

    const setStateDig1 = (data) => {
        setDig1(data);
    };

    const setRendering = useCallback(
        (initTopPoint, initLeftPoint, items) =>
            mapUtils.rendering(initTopPoint, initLeftPoint, items),
        [dig1],
    );

    useEffect(() => {
        if (dig1.length === 0) {
            mapUtils.bind(first, setStateDig1);
            // bind(first, setStateDig1);
        }
    }, []);

    return (
        <MapCompo>
            <div className="map-area">
                {dig1.length > 0 && setRendering(439, -66, dig1)}
            </div>
        </MapCompo>
    );
};

export default MapContainer;
