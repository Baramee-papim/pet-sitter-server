const intentResponse = {
  welcome: (language: "th" | "en") => {
    const responses = {
      th: [
        "สวัสดีครับ 👋 ยินดีต้อนรับสู่บริการหาพี่เลี้ยงสัตว์ 🐶🐱\nผมช่วยคุณค้นหาพี่เลี้ยงตามพื้นที่และประเภทสัตว์ได้เลยนะครับ",
        "หวัดดีครับ 😊 ผมสามารถช่วยคุณหาพี่เลี้ยงสัตว์ได้\nลองบอกผมได้เลยว่าคุณต้องการดูแลสัตว์ประเภทไหนและอยู่แถวไหน",
        "สวัสดีครับ! 🐾 กำลังมองหาพี่เลี้ยงสัตว์อยู่ใช่ไหม\nผมช่วยคุณหาได้ตามพื้นที่และประเภทสัตว์เลยครับ",
        "ยินดีต้อนรับครับ 🎉 ผมคือผู้ช่วยหาพี่เลี้ยงสัตว์\nคุณสามารถถามหาได้เลย เช่น 'หาพี่เลี้ยงแมวในบางนา'",
        "สวัสดีครับ 👋 มีอะไรให้ผมช่วยไหมครับ\nผมสามารถช่วยหาพี่เลี้ยงสัตว์ให้เหมาะกับคุณได้ 🐶🐱",
        "หวัดดีครับ 🐾 ถ้าคุณกำลังหาพี่เลี้ยงสัตว์ ผมช่วยได้เลย\nลองพิมพ์บอกผม เช่น 'หาพี่เลี้ยงหมาในกรุงเทพ'",
        "สวัสดีครับ 😊 ผมช่วยค้นหาพี่เลี้ยงสัตว์ใกล้คุณได้\nบอกผมได้เลยว่าคุณมีสัตว์อะไรและอยู่แถวไหน",
        "ยินดีต้อนรับครับ 👋 พร้อมช่วยหาพี่เลี้ยงสัตว์ให้คุณเสมอ\nลองพิมพ์สิ่งที่ต้องการได้เลยครับ",
      ],

      en: [
        "Hello 👋 Welcome to our pet sitter finder 🐶🐱\nI can help you find sitters based on your location and pet type",
        "Hi there 😊 Looking for a pet sitter?\nI can help you find the right one for your pet",
        "Hello! 🐾 I’m here to help you find a pet sitter\nJust tell me your pet type and location",
        "Welcome 🎉 I can help you find trusted pet sitters\nTry something like 'Find a cat sitter in Bangna'",
        "Hi 👋 Need help finding a pet sitter?\nJust let me know what you're looking for",
        "Hey 😊 I can help you find pet sitters near you\nTell me your pet and location",
        "Hello 👋 I’m your pet sitter assistant 🐶🐱\nAsk me anything about finding a sitter",
        "Hi there 🐾 Looking for someone to take care of your pet?\nI’ve got you covered!",
      ],
    };

    const list = responses[language] || responses.en;
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  },

  botCapability: (language: "th" | "en") => {
    const responses = {
      th: [
        "ผมสามารถช่วยคุณ:\n- ค้นหาพี่เลี้ยงสัตว์ตามพื้นที่ 📍\n- แนะนำบริการที่เหมาะกับสัตว์เลี้ยง 🐶🐱\n- ตอบคำถามเกี่ยวกับการใช้งานระบบ\n\nลองพิมพ์: 'หาพี่เลี้ยงแมวในบางนา'",
        "ผมช่วยคุณหาพี่เลี้ยงสัตว์ได้ง่าย ๆ 😊\nแค่บอกประเภทสัตว์และพื้นที่ เช่น\n👉 'หาพี่เลี้ยงหมาในกรุงเทพ'",
        "ผมเป็นผู้ช่วยหาพี่เลี้ยงสัตว์ 🐾\nสามารถค้นหาคนดูแลสัตว์ตามความต้องการของคุณได้\n\nลองบอกผมได้เลยว่าคุณต้องการอะไร",
        "ผมช่วยคุณ:\n- หาพี่เลี้ยงสัตว์ใกล้คุณ\n- แนะนำบริการต่าง ๆ\n- ตอบคำถามเกี่ยวกับระบบ\n\nเช่น 'มีพี่เลี้ยงแมวไหม'",
        "ถ้าคุณกำลังหาพี่เลี้ยงสัตว์ ผมช่วยได้เลย 🐶🐱\nแค่พิมพ์บอกผม เช่น 'หาพี่เลี้ยงหมาแถวบางนา'",
        "ผมสามารถช่วยค้นหาพี่เลี้ยงสัตว์ให้เหมาะกับคุณได้ 🎯\nทั้งตามพื้นที่และประเภทสัตว์\n\nลองพิมพ์สิ่งที่ต้องการได้เลยครับ",
        "ผมช่วยให้คุณหาพี่เลี้ยงสัตว์ได้สะดวกขึ้น 😊\nไม่ว่าจะเป็นหมา แมว หรือสัตว์อื่น ๆ\n\nลองเริ่มจากบอกผมว่าคุณอยู่ที่ไหน",
        "ผมช่วยคุณหาคนดูแลสัตว์ได้ตามที่ต้องการ 🐾\nเช่น พื้นที่ ประเภทสัตว์ หรือบริการ\n\nลองถามมาได้เลยครับ",
      ],

      en: [
        "I can help you:\n- Find pet sitters near your location 📍\n- Recommend services for your pet 🐶🐱\n- Answer questions about how the platform works\n\nTry: 'Find a cat sitter in Bangna'",
        "I can help you find the perfect pet sitter 😊\nJust tell me your pet type and location\n👉 'Find a dog sitter in Bangkok'",
        "I'm your pet sitter assistant 🐾\nI can help you search for sitters based on your needs\n\nJust tell me what you're looking for",
        "I can:\n- Find pet sitters near you\n- Suggest suitable services\n- Help you understand how the system works\n\nTry asking me anything!",
        "Looking for a pet sitter? 🐶🐱\nI’ve got you covered!\nJust type something like 'Cat sitter in Bangna'",
        "I can help you quickly find pet sitters 🎯\nbased on location and pet type\n\nJust tell me what you need",
        "I make it easy to find pet care 😊\nWhether you have a dog, cat, or other pets\n\nStart by telling me your location",
        "Need someone to take care of your pet? 🐾\nI can help you find the right sitter\n\nJust let me know your requirements",
      ],
    };

    const list = responses[language] || responses.en;
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  },

  searchSitterGeneral: (language: "th" | "en") => {
    const responses = {
      th: [
        "ผมช่วยหาพี่เลี้ยงให้ได้นะครับ 😊\nขอข้อมูลเพิ่มนิดนึง:\n- สัตว์ประเภทอะไร 🐶🐱🐰🐦\n- อยู่แถวไหน 📍\n\nลองพิมพ์: 'หาพี่เลี้ยงแมวในบางนา'",
        "ได้เลยครับ 👍 เดี๋ยวผมหาพี่เลี้ยงให้\nขอทราบเพิ่มนิดนึงว่าคุณมีสัตว์อะไร และอยู่พื้นที่ไหนครับ",
        "ยินดีช่วยครับ 🐾 แต่ขอรายละเอียดเพิ่มหน่อย:\nคุณต้องการให้ดูแลสัตว์อะไร และอยู่จังหวัดหรือเขตไหน",
        "ผมหาพี่เลี้ยงให้ได้ครับ 😊\nช่วยบอกผมเพิ่มหน่อยว่าเป็นสัตว์อะไร และอยู่แถวไหน",
        "กำลังหาพี่เลี้ยงอยู่ใช่ไหมครับ 🐶🐱\nช่วยบอกประเภทสัตว์และพื้นที่นิดนึง เดี๋ยวผมหาให้เลย",
        "ได้เลยครับ 🎯 เพื่อหาที่เหมาะที่สุด\nช่วยบอกประเภทสัตว์และ location ให้ผมหน่อยครับ",
        "ผมพร้อมช่วยหาพี่เลี้ยงให้ครับ 😊\nแค่บอกว่าเป็นสัตว์อะไร และอยู่แถวไหน",
        "ไม่มีปัญหาครับ 🐾 เดี๋ยวจัดให้\nขอรู้แค่ว่าคุณต้องการดูแลสัตว์อะไร และอยู่พื้นที่ไหนครับ",
      ],

      en: [
        "I can help you find a pet sitter 😊\nCould you tell me:\n- What type of pet? 🐶🐱🐰🐦\n- Which location? 📍\n\nTry: 'Find a cat sitter in Bangna'",
        "Sure 👍 I can help with that\nCould you tell me your pet type and location?",
        "Happy to help 🐾\nJust let me know what kind of pet you have and where you are",
        "I can find a sitter for you 😊\nPlease tell me your pet type and location",
        "Looking for a pet sitter? 🐶🐱\nTell me your pet and location, and I’ll find one for you",
        "Got it 🎯 To find the best match,\nplease share your pet type and location",
        "No problem 😊 I can help you find a sitter\nJust tell me your pet and where you are",
        "I’m ready to help 🐾\nWhat kind of pet do you have and where are you located?",
      ],
    };

    const list = responses[language] || responses.en;
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  },

  thankYou: (language: "th" | "en") => {
    const responses = {
      th: [
        "ยินดีครับ 😊 ถ้ามีอะไรให้ช่วยเพิ่มเติม บอกผมได้เลยนะครับ",
        "ด้วยความยินดีครับ 🙏 ถ้าต้องการหาพี่เลี้ยงสัตว์เพิ่มเติม ผมช่วยได้เสมอ",
        "ไม่เป็นไรเลยครับ 😊 ผมพร้อมช่วยคุณเสมอ 🐾",
        "ยินดีมากครับ 🎉 ถ้ามีคำถามเพิ่มเติมหรืออยากหาพี่เลี้ยง บอกได้เลย",
        "ครับผม 😊 ถ้าต้องการความช่วยเหลือเพิ่มเติม ผมอยู่ตรงนี้เสมอ",
        "ยินดีครับ 🐶🐱 ถ้ายังหาพี่เลี้ยงอยู่ ลองบอกผมเพิ่มได้นะครับ",
        "ด้วยความยินดีครับ 😊 หวังว่าจะช่วยคุณได้ ถ้ามีอะไรเพิ่มเติมถามได้เลย",
        "โอเคครับ 👍 ถ้ามีอะไรให้ช่วยอีก บอกผมได้เสมอครับ",
      ],

      en: [
        "You're welcome 😊 Let me know if you need anything else",
        "No problem at all 🙏 I'm here to help anytime",
        "Glad I could help 😊 Feel free to ask me anything",
        "You're very welcome 🎉 If you need help finding a pet sitter, just ask",
        "Anytime 👍 Let me know if you need more assistance",
        "Happy to help 🐾 Just tell me if you need anything else",
        "You're welcome 😊 I’m always here if you need help",
        "No worries 😄 Let me know if there's anything more I can do",
      ],
    };

    const list = responses[language] || responses.en;
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  },

  fallback: (language: "th" | "en") => {
    const responses = {
      th: [
        "ขออภัยครับ 😅 ผมอาจยังไม่เข้าใจคำถามนี้\nแต่ผมช่วยคุณหาพี่เลี้ยงสัตว์ได้นะครับ 🐶🐱\n\nลองพิมพ์: 'หาพี่เลี้ยงแมวในบางนา'",
        "อืม 🤔 ผมยังไม่แน่ใจว่าคุณหมายถึงอะไร\nแต่ถ้าคุณกำลังหาพี่เลี้ยงสัตว์ ผมช่วยได้ครับ\n\nลองบอกประเภทสัตว์และพื้นที่มาได้เลย",
        "ขอโทษครับ ผมยังไม่เข้าใจคำถามนี้ 🙏\nแต่ผมสามารถช่วยหาพี่เลี้ยงสัตว์ให้คุณได้\n\nเช่น 'หาพี่เลี้ยงหมาในกรุงเทพ'",
        "ผมอาจจะยังไม่เข้าใจสิ่งที่คุณพิมพ์ 😅\nลองพิมพ์ใหม่อีกครั้ง หรือถามเกี่ยวกับพี่เลี้ยงสัตว์ได้เลยครับ",
        "ยังไม่เข้าใจคำถามนี้ครับ 🤔\nแต่ผมช่วยคุณหาพี่เลี้ยงสัตว์ได้นะ\n\nลองพิมพ์ตัวอย่างที่ใกล้เคียงดูครับ",
        "ขออภัยครับ 🙏 ผมยังตอบคำถามนี้ไม่ได้\nแต่สามารถช่วยหาพี่เลี้ยงสัตว์ให้คุณได้\n\nลองถามเกี่ยวกับการหาพี่เลี้ยงดูนะครับ",
        "ผมอาจจะยังไม่เข้าใจ 😅\nลองพิมพ์ใหม่ หรือบอกผมว่าคุณต้องการหาพี่เลี้ยงสัตว์แบบไหน",
        "ยังไม่เข้าใจครับ 🤖\nแต่ถ้าคุณกำลังหาพี่เลี้ยงสัตว์ ผมช่วยได้เต็มที่เลยครับ 🐾",
      ],

      en: [
        "Sorry 😅 I didn’t quite understand that\nBut I can help you find a pet sitter 🐶🐱\n\nTry: 'Find a cat sitter in Bangna'",
        "Hmm 🤔 I’m not sure what you mean\nBut I can help you find a pet sitter\n\nJust tell me your pet and location",
        "Sorry about that 🙏 I didn’t understand your request\nBut I can help you find pet sitters\n\nTry something like 'Dog sitter in Bangkok'",
        "I’m not sure I got that 😅\nCould you rephrase?\nOr ask me about finding a pet sitter 🐾",
        "I didn’t catch that 🤔\nBut I can help you find someone to take care of your pet\n\nJust tell me what you need",
        "Sorry, I don’t understand that yet 🙏\nBut I can help you with pet sitter searches\n\nGive it a try!",
        "Hmm, that’s a bit unclear 😅\nTry asking me about pet sitters, I’d be happy to help",
        "I’m not sure what you mean 🤖\nBut I can definitely help you find a pet sitter 🐾",
      ],
    };

    const list = responses[language] || responses.en;
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  },
};

export default intentResponse;
