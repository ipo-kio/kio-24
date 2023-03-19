let circuits=[
    {
        name: "0",
        ports: 2,
        centerPorts: 3,
        tests: [...Array(4).keys()],
        elements: [{"name":"not_0","type":"not","pos":{"x":0.21940664375715924,"y":0.2}},{"name":"and_0","type":"and","pos":{"x":0.17672989690721652,"y":0.39444444444444443}},{"name":"and_1","type":"and","pos":{"x":0.3075780068728522,"y":0.6027777777777777}}],
        wires: [{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"not_0","type":"input","id":0}},{"startPort":{"element":"not_0","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":0}},{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"and_0","type":"input","id":0}},{"startPort":{"element":"and_0","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":1}},{"startPort":{"element":"output_bar","type":"output","id":1},"endPort":{"element":"and_0","type":"input","id":1}},{"startPort":{"element":"not_0","type":"output","id":0},"endPort":{"element":"and_1","type":"input","id":0}},{"startPort":{"element":"output_bar","type":"output","id":1},"endPort":{"element":"and_1","type":"input","id":1}},{"startPort":{"element":"and_1","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":2}}]
    },

    {
        name: "1",
        ports: 3,
        centerPorts: 4,
        tests: [...Array(8).keys()],
        elements: [],
        wires: []
    },

    {
        name: "2",
        ports: 4,
        centerPorts: 4,
        tests: [...Array(16).keys()],
        elements: [{"name":"and_0","type":"and","pos":{"x":0.16188125,"y":0.46012921594393336}},{"name":"or_1","type":"or","pos":{"x":0.4230159722222223,"y":0.5069718207037524}},{"name":"not_0","type":"not","pos":{"x":0.15407777777777776,"y":0.7006825813987443}},{"name":"not_2","type":"not","pos":{"x":0.2430381944444444,"y":0.45807599649583874}},{"name":"and_4","type":"and","pos":{"x":0.2650770833333333,"y":0.34125967294495546}},{"name":"and_1","type":"and","pos":{"x":0.21715416666666662,"y":0.0687709884654694}},{"name":"and_2","type":"and","pos":{"x":0.31298125,"y":0.15404986129361953}},{"name":"or_0","type":"or","pos":{"x":0.41512847222222227,"y":0.3102642721565192}},{"name":"and_3","type":"and","pos":{"x":0.22089166666666665,"y":0.5596054168491751}},{"name":"and_5","type":"and","pos":{"x":0.33260625,"y":0.7015896481238136}},{"name":"not_3","type":"not","pos":{"x":0.4250694444444444,"y":0.10252044094028324}},{"name":"not_1","type":"not","pos":{"x":0.18149652777777775,"y":0.3445941013286611}},{"name":"or_2","type":"or","pos":{"x":0.43115138888888893,"y":0.6970999415973136}}],
        wires: [{"startPort":{"element":"output_bar","type":"output","id":1},"endPort":{"element":"not_1","type":"input","id":0}},{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"and_2","type":"input","id":0}},{"startPort":{"element":"not_1","type":"output","id":0},"endPort":{"element":"and_4","type":"input","id":1}},{"startPort":{"element":"output_bar","type":"output","id":1},"endPort":{"element":"and_0","type":"input","id":1}},{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"and_0","type":"input","id":0}},{"startPort":{"element":"output_bar","type":"output","id":2},"endPort":{"element":"not_0","type":"input","id":0}},{"startPort":{"element":"and_2","type":"output","id":0},"endPort":{"element":"or_0","type":"input","id":0}},{"startPort":{"element":"output_bar","type":"output","id":1},"endPort":{"element":"and_2","type":"input","id":1}},{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"and_4","type":"input","id":0}},{"startPort":{"element":"and_4","type":"output","id":0},"endPort":{"element":"or_0","type":"input","id":1}},{"startPort":{"element":"not_0","type":"output","id":0},"endPort":{"element":"and_3","type":"input","id":1}},{"startPort":{"element":"and_0","type":"output","id":0},"endPort":{"element":"and_3","type":"input","id":0}},{"startPort":{"element":"and_0","type":"output","id":0},"endPort":{"element":"not_2","type":"input","id":0}},{"startPort":{"element":"not_2","type":"output","id":0},"endPort":{"element":"and_5","type":"input","id":0}},{"startPort":{"element":"output_bar","type":"output","id":2},"endPort":{"element":"and_5","type":"input","id":1}},{"startPort":{"element":"and_3","type":"output","id":0},"endPort":{"element":"or_1","type":"input","id":0}},{"startPort":{"element":"and_5","type":"output","id":0},"endPort":{"element":"or_1","type":"input","id":1}},{"startPort":{"element":"or_0","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":1}},{"startPort":{"element":"output_bar","type":"output","id":3},"endPort":{"element":"and_1","type":"input","id":1}},{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"and_1","type":"input","id":0}},{"startPort":{"element":"and_1","type":"output","id":0},"endPort":{"element":"not_3","type":"input","id":0}},{"startPort":{"element":"or_1","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":2}},{"startPort":{"element":"or_2","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":3}},{"startPort":{"element":"and_1","type":"output","id":0},"endPort":{"element":"or_2","type":"input","id":0}},{"startPort":{"element":"not_2","type":"output","id":0},"endPort":{"element":"or_2","type":"input","id":1}},{"startPort":{"element":"not_3","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":0}}]
    },
]

export default circuits
