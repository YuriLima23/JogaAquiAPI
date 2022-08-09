import prisma from '../src/database/index'


async function seed() {
    const types_recicles : Array<any> = [{
        price: "0.50",
        color: "#F61515",
        name: "Plasticos",
    },
    {
        price: "0.01",
        color: "#20AA2C",
        name: "Vidros",
    },
    {
        price: "0.75",
        color: "#3F4BC4",
        name: "Papeis",
    },
    {
        price: "0.20",
        color: "#B3C71C",
        name: "Metais",
    },
    ]

    await prisma.type_Recicle.createMany({data:types_recicles})
}

seed()