export default [
    {
      name: 'Ballon perché',
      startingItems: [
        'Tissu',
        'Crayons de couleur',
        'Briquet',
        'Ciseaux',
        'Tournesol',
        'Taille-crayon',
        'Colle',
        'Terre',
        'Stylo',
      ],
      recipes: [
        {input: ['Stylo', 'Colle'], output: ['Échelle']},
        {
          input: ['Costume de super-héros', 'Poudre de perlinpinpin'],
          output: ['Super-héros']
        },
        {
          input: ['Tissu', 'Crayons de couleur'],
          output: ['Costume de super-héros']
        },
        {input: ['Pétard', 'Terre'], output: ['Poudre de perlinpinpin']},
        {
          input: ['Métal en dent de scie', 'Moteur'],
          output: ['Tronçonneuse sans huile']
        },
        {input: ['Tronçonneuse sans huile', 'Huile'], output: ['Tronçonneuse']},
        {input: ['Taille-crayon', 'Briquet'], output: ['Tôle']},
        {input: ['Tôle', 'Briquet'], output: ['Moteur']},
        {input: ['Tournesol'], output: ['Huile de tournesol']},
      ],
      easySolution: 'Échelle',
      expertSolution: 'Super-héros',
      failSolution: 'Tronçonneuse',
      dialogsBegin: [
        'Oh non j\'ai coincé mon ballon dans l\'arbre ! Mais que faire ! Fichtre ! Cornebidouille ! Me voilà bien dans l\'embarras 😳',
        'Ah, comment est-ce que je vais bien pouvoir me débrouiller avec ce que j\'ai sous la main ?'
      ],
      dialogsEasySolution: [
        'Ouhla elle est pas très stable cette échelle ! Enfin j\'ai réussi à récupérer mon ballon c\'est l\'essentiel !',
        'Mais je me demande quand même si je n\'aurais pas pu faire autrement...'
      ],
      dialogsExpertSolution: [
        'Par le pouvoir de perlinpinpin ! Je décolle ! Récupérer ce ballon a été un jeu d\'enfant ! 🦸'
      ],
      dialogsFail: [
        '<i>L\'arbre tombe sur votre petit crâne.</i>',
        'Oups, je comprends maintenant pourquoi on ne m\'a jamais laissé me servir de la tronçonneuse à la maison 😳',
      ],
    },
    {
      name: 'Infiltration au CDI',
      startingItems: ['Taille-crayon',
          'briquet',
          'ciseaux',
          'gomme',
          'stylo',
          'compas',
          'papier',
          'crayons de couleur',
      recipes: [],
      easySolution: '',
      expertSolution: '',
      failSolution: '',
      dialogsBegin: [
        'Et si j\'allais jouer à Dofus ? Le CDI est fermé à cette heure là mais ce n\'est pas un problème pour moi !',
        'Comment vais-je bien pouvoir ouvrir cette porte ?',
      ],
      dialogsEasySolution: [
        'Wow je viens de hack-clé le CDI ! Wouhou ! À moi les kamas !',
      ],
      dialogsExpertSolution: ['Ni vu ni connu ! Aucune porte ne me résiste !'],
      dialogsFail: [
        'Bêêêêêêêh',
        'Oww, le bélier était en fait une chèvre 🐐',
        'C\'est mignon mais ce n\'est pas avec ça qu\'on va ouvrir la porte ! Dommage, je suppose que jouer avec la chèvre c\'est bien aussi.',
      ],
    },
    {
      name: 'Révolte contre le caïd',
      startingItems: [],
      recipes: [],
      easySolution: '',
      expertSolution: '',
      failSolution: '',
      dialogsBegin: [
        'J\'en ai marre de me faire tout le temps embêter par Pierre-Siméon, il va voir de quel bois je me chauffe !',
      ],
      dialogsEasySolution: [
        'Héhé, si il me vole encore mon goûter il aura une drôle de surprise !',
      ],
      dialogsExpertSolution: ['Voilà une réponse qui a du piquant 😈'],
      dialogsFail: [
        '<i>KABOOM 💥💥💥</i>', 'Aouch !',
        '<i>Le pétard vous explose à la figure, il fallait souffler, pas fumer le pétard voyons !</i>'
      ],
    },
    {
      name: 'Un fâcheux incident',
      startingItems: [],
      recipes: [],
      easySolution: '',
      expertSolution: '',
      failSolution: '',
      dialogsBegin: [
        'Oh non, le ballon est parti dans la fenêtre. Elle est en 1000 morceaux, je vais me faire disputer !',
        'À moins que... 😏'
      ],
      dialogsEasySolution: [
        'Héhé, cette colle est si puissante qu\'elle pourrait même clouer le bec à Pierre-Siméon !',
        'Ni une ni deux, la fenêtre est réparée !',
      ],
      dialogsExpertSolution: ['Carglass répare, Carglass remplace 🎵'],
      dialogsFail: [
        'Arff, mes talents de dessin ne les ont pas convaincu, je me suis pris un sacré savon 😢🧼',
        'Pourtant mes bonhommes bâton étaient magnifiques !',
      ],
    },
    {
      name: 'Le contrôle',
      startingItems: [],
      recipes: [],
      easySolution: '',
      expertSolution: '',
      failSolution: '',
      dialogsBegin: [
        'Oh non, j\'ai complètement oublié de réviser pour mon contrôle !',
        'Comment est-ce que je vais faire ?',
      ],
      dialogsEasySolution: [
        'Pas très pratique sur ce petit bout de papier, mais j\'ai au moins pu sauver les meubles !',
      ],
      dialogsExpertSolution: [
        'Rien n\'échappe à mon super satellite 3000 ! Tricher sur mon voisin n\'a jamais été aussi facile !'
      ],
      dialogsFail: [
        'Mince j\'avais oublié que mon professeur était un ancien mafieu !',
        'Les faux billets ne lui ont pas vraiment plu et je crois que ses anciens amis veulent ma peau 😳',
      ],
    },
  ]