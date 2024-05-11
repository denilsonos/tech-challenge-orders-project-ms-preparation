export const createOrderSwagger = () => ({
    schema: {
        tags: ['Order'],
        body: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            itemId: { type: 'number' },
                            quantity: { type: 'number' },
                        }
                    }
                },
            }
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    orderId: { type: 'number' },
                    total: { type: 'number' },
                }
            },
            400: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    'issues': {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                fatal: { type: 'boolean' },
                                message: { type: 'string' },
                            }
                        }
                    },
                }
            },
            404: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                }
            }
        }
    }
})

export const findOrderSwagger = () => ({
    schema: {
        tags: ['Order'],
        query: {
            status: { type: 'string' }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    orders: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                idOrder: { type: 'string' },
                                status: { type: 'string' },
                                createdAt: { type: 'string' },
                                updatedAt: { type: 'string' },
                            }
                        }
                    },
                }
            },
            400: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    'issues': {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                fatal: { type: 'boolean' },
                                message: { type: 'string' },
                            }
                        }
                    },
                }
            },
        }
    }
})

export const updateOrderSwagger = () => ({
    schema: {
        tags: ['Order'],
        params: {
            id: { type: 'string' }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                }
            },
            400: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    'issues': {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                fatal: { type: 'boolean' },
                                message: { type: 'string' },
                            }
                        }
                    },
                }
            },
            404: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                }
            },
            409: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                }
            }
        }
    }
})

export const getAllOrders = () => ({
    schema: {
        tags: ['Order'],
        response: {
            200: {
                type: 'object',
                properties: {
                    'orders': {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                orderId: { type: 'number' },
                                status: { type: 'string' },
                                clientId: { type: 'number' },
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            itemId: { type: 'number' },
                                            name: { type: 'string' },
                                            description: { type: 'string' },
                                            category: { type: 'string' },
                                            value: { type: 'number' },
                                            image: { type: 'string' },
                                            createdAt: { type: 'string' },
                                            updatedAt: { type: 'string' },
                                        }
                                    }
                                },
                                total: { type: 'number' },
                                createdAt: { type: 'string' },
                                updatedAt: { type: 'string' },
                            }
                        }
                    }
                }
            }
        }
    }
});
