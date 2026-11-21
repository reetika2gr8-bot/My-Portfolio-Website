/**
 * Every line of dialogue in the room lives here.
 * - Arrays are cycled through (not purely random) so repeat visitors see variety.
 * - `escalation` lines unlock after repeated pokes (key = poke count reached).
 * - `expression` must be one of: curious, annoyed, neutral, smiling, surprised, sleepy
 */
export const DIALOGUE = {
  character: {
    pokes: [
      { text: 'You poked me!', expression: 'surprised' },
      { text: "Do you mind? I'm working.", expression: 'annoyed' },
      { text: 'What?', expression: 'curious' },
      { text: 'Are you here to see my work?', expression: 'smiling' },
      { text: "Hey! I'm trying to finish this.", expression: 'annoyed' },
      { text: "You can explore, but don't disturb my cat.", expression: 'neutral' },
      { text: 'Stop distracting me.', expression: 'annoyed' },
      { text: 'Okay, one more poke.', expression: 'smiling' },
    ],
    escalation: {
      6: { text: "Seriously? It's the monitor you want. My work is in there.", expression: 'annoyed' },
      10: { text: "Fine. FINE. I'll show you my work myself.", expression: 'smiling', action: 'open:projects' },
    },
    sleepyPokes: [
      { text: 'Mmh… five more minutes…', expression: 'sleepy' },
      { text: "I'm awake. I'm totally awake.", expression: 'sleepy' },
    ],
    lampOff: { text: "Hey! I can't see anything.", expression: 'surprised' },
    lampBackOn: { text: 'Much better.', expression: 'neutral' },
    catDefend: { text: "Don't poke my cat.", expression: 'annoyed' },
  },

  cat: [
    { text: "Don't poke my cat.", speaker: 'character' },
    { text: "She's busy sleeping.", speaker: 'character' },
    { text: 'Mrrp?', speaker: 'cat' },
    { text: "She's the real boss here.", speaker: 'character' },
    { text: 'You disturbed her nap.', speaker: 'character' },
    { text: 'That was rude.', speaker: 'cat' },
  ],

  coffee: [
    'Fuel for creativity.',
    "My fourth cup. Don't judge.",
    'This is probably a design requirement.',
    'Coffee and questionable decisions.',
    'Powered by caffeine.',
  ],

  objects: {
    plant: ["That's Basil. He's thriving. Mostly.", 'I water him when I remember.', 'Basil says hi.'],
    poster: ['Someday I want to go there.', 'I painted that one. Well, the sky part.'],
    drawer: ['Nothing to see here. Just 47 cables.', 'Snacks. Emergency snacks only.'],
    plane: ['Whoosh.', 'I made that out of a failed sketch.'],
    star: ['You found a star. Make a wish.', 'Another one! They glow at night.', 'All the stars! You are very thorough.'],
    clock: (hour) =>
      hour < 5 ? "It's very late. Shouldn't we both be asleep?"
      : hour < 12 ? 'Good morning! Coffee first.'
      : hour < 17 ? 'Afternoon already? Where did the day go.'
      : hour < 21 ? 'Evening. Best time to make things.'
      : 'Night owl hours.',
  },

  ambience: {
    'rainy-evening': 'I love the sound of rain.',
    'sunny-afternoon': 'Ooh, sunshine.',
    'late-night': '…is it that late already?',
    'autumn-wind': 'It got chilly.',
    'dreamy-starlight': 'Pretty.',
  },
};
