import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Table } from "antd";

import { selectAdminStateUser, selectIsAdminStateLoading } from "../../../redux-toolkit/admin/admin-selector";
import { selectOrders, selectTotalElements } from "../../../redux-toolkit/orders/orders-selector";
import { fetchUserInfo } from "../../../redux-toolkit/admin/admin-thunks";
import { resetOrders } from "../../../redux-toolkit/orders/orders-slice";
import { resetAdminState } from "../../../redux-toolkit/admin/admin-slice";
import { LoadingStatus, OrderResponse, UserOrdersRequest } from "../../../types/types";
import { fetchUserOrdersByEmail } from "../../../redux-toolkit/orders/orders-thunks";
import Spinner from "../../../components/Spinner/Spinner";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import AccountDataItem from "../../../components/AccountDataItem/AccountDataItem";
import { ACCOUNT_USER_ORDERS } from "../../../constants/routeConstants";
import { useTablePagination } from "../../../hooks/useTablePagination";

const ManageUser: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const params = useParams<{ id: string }>();
    const userData = useSelector(selectAdminStateUser);
    const userOrders = useSelector(selectOrders);
    const totalElements = useSelector(selectTotalElements);
    const isUserLoading = useSelector(selectIsAdminStateLoading);
    const handleTableChange = useTablePagination<OrderResponse, UserOrdersRequest>(fetchUserOrdersByEmail, userData.email!);
    const { id, email, firstName, lastName, city, address, phoneNumber, postIndex, provider, roles } = userData;

    useEffect(() => {
        dispatch(fetchUserInfo(params.id));

        return () => {
            dispatch(resetOrders());
            dispatch(resetAdminState(LoadingStatus.LOADING));
        };
    }, []);

    useEffect(() => {
        if (userData.email) {
            dispatch(fetchUserOrdersByEmail({ email: userData.email!, page: 0 }));
        }
    }, [userData]);

    return (
        <>
            {isUserLoading ? (
                <Spinner />
            ) : (
                <>
                    <ContentTitle title={`Kullan??c??: ${firstName} ${lastName}`} titleLevel={4} icon={<UserOutlined />} />
                    <Row>
                        <Col span={24}>
                            <Card>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <AccountDataItem title={"Kullan??c?? id"} text={id} />
                                        <AccountDataItem title={"Email"} text={email} />
                                        <AccountDataItem title={"Rol??"} text={roles} />
                                        <AccountDataItem title={"Ad??"} text={firstName} />
                                        <AccountDataItem title={"Spyado"} text={lastName} />
                                    </Col>
                                    <Col span={8}>
                                        <AccountDataItem title={"Sa??lay??c??"} text={provider} />
                                        <AccountDataItem title={"??ehir"} text={city} />
                                        <AccountDataItem title={"Adres"} text={address} />
                                        <AccountDataItem title={"Telefon"} text={phoneNumber} />
                                        <AccountDataItem title={"Posta kodu"} text={postIndex} />
                                    </Col>
                                </Row>
                            </Card>
                            <Row style={{ marginTop: 16 }}>
                                <Col span={24}>
                                    {userOrders.length === 0 ? (
                                        <div style={{ textAlign: "center" }}>
                                            <ContentTitle title={"Sipari?? yok"} titleLevel={4} />
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ textAlign: "center" }}>
                                                <ContentTitle title={"Sipari??ler"} titleLevel={4} />
                                            </div>
                                            <Table
                                                rowKey={"id"}
                                                onChange={handleTableChange}
                                                pagination={{
                                                    total: totalElements,
                                                    position: ["bottomRight", "topRight"]
                                                }}
                                                dataSource={userOrders}
                                                columns={[
                                                    {
                                                        title: "Sipari?? No",
                                                        dataIndex: "id",
                                                        key: "id"
                                                    },
                                                    {
                                                        title: "Tarih",
                                                        dataIndex: "date",
                                                        key: "date"
                                                    },
                                                    {
                                                        title: "??ehir",
                                                        dataIndex: "city",
                                                        key: "city"
                                                    },
                                                    {
                                                        title: "Adres",
                                                        dataIndex: "address",
                                                        key: "address"
                                                    },
                                                    {
                                                        title: "Posta kodu",
                                                        dataIndex: "postIndex",
                                                        key: "postIndex"
                                                    },
                                                    {
                                                        title: "Sipari?? ??zeti",
                                                        dataIndex: "totalPrice",
                                                        key: "totalPrice",
                                                        render: (_, order: OrderResponse) => `${order.totalPrice}.0???`
                                                    },
                                                    {
                                                        title: "Sipari??ler",
                                                        dataIndex: "actions",
                                                        key: "actions",
                                                        render: (_, order: OrderResponse) => (
                                                            <Link to={`${ACCOUNT_USER_ORDERS}/${order.id}`}>
                                                                Daha fazla
                                                            </Link>
                                                        )
                                                    }
                                                ]}
                                            />
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default ManageUser;
