// Smooth scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// Job descriptions
const jobDescriptions = {
  software: "Design, develop, and maintain scalable software applications. Skills: Java, Python, Data Structures, Algorithms, OOP, Git, REST APIs.",
  frontend: "Build responsive web interfaces. Skills: HTML, CSS, JavaScript, React, UI/UX, Tailwind, Git.",
  backend: "Develop server-side logic and APIs. Skills: Node.js, Express, Python, Databases, REST APIs, Authentication.",
  ai: "Build machine learning models. Skills: Python, TensorFlow, PyTorch, NLP, Data Analysis, Statistics.",
  data: "Analyze and visualize data. Skills: SQL, Excel, Python, Power BI, Tableau, Statistics.",
  db: "Manage databases and ensure performance. Skills: SQL, Oracle, MySQL, Backup, Security, Optimization.",
  cloud: "Deploy and manage cloud systems. Skills: AWS, Azure, Docker, Kubernetes, CI/CD.",
  cyber: "Protect systems from cyber threats. Skills: Networking, Ethical Hacking, Security Tools, Cryptography.",
  mobile: "Develop Android/iOS apps. Skills: Java, Kotlin, Flutter, React Native, APIs.",
  qa: "Test software for bugs and quality. Skills: Selenium, Manual Testing, Automation, Test Cases.",
  devops: "Automate deployments and infrastructure. Skills: Docker, Kubernetes, Jenkins, CI/CD, Linux.",
  uiux: "Design user-friendly interfaces. Skills: Figma, Adobe XD, Wireframing, Prototyping.",
  pm: "Manage product lifecycle. Skills: Agile, Roadmaps, Communication, Market Analysis.",
  ba: "Analyze business requirements. Skills: Excel, SQL, Communication, Documentation.",
  prompt: "Design prompts for AI systems. Skills: NLP, LLMs, Prompt Design, AI Tools."
};

// Fill description
function updateDescription() {
  const role = document.getElementById("jobRole").value;
  document.getElementById("jobDescription").value = jobDescriptions[role] || "";
}

// Extract text
async function extractText(file) {
  const type = file.name.split('.').pop().toLowerCase();

  if (type === "txt") return await file.text();

  if (type === "pdf") {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ");
    }
    return text;
  }

  if (type === "docx") {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  }

  return "";
}

// Roadmap
function generateRoadmap(missing) {
  let html = "<h3>📚 Learning Roadmap</h3>";

  missing.forEach((skill, i) => {
    html += `
      <div style="background:#1e293b; padding:10px; margin:10px; border-radius:10px;">
        <h4>Step ${i + 1}: ${skill.toUpperCase()}</h4>
        <p>• Learn basics<br>• Practice<br>• Build project</p>
      </div>
    `;
  });

  if (!missing.length) {
    html += "<p>🎉 You are job ready!</p>";
  }

  return html;
}

// Main function
async function analyzeSkills() {
  const fileInput = document.getElementById("resumeFile");
  const jobDesc = document.getElementById("jobDescription").value.toLowerCase();

  if (!fileInput.files.length) {
    alert("Upload resume");
    return;
  }

  if (!jobDesc) {
    alert("Select or enter job description");
    return;
  }

  const text = (await extractText(fileInput.files[0])).toLowerCase();

  const stopWords = ["and", "the", "with", "for", "a", "to", "of"];

  const jobSkills = jobDesc.split(/[\s,.\n]+/).filter(
    word => word.length > 2 && !stopWords.includes(word)
  );

  const missing = [...new Set(jobSkills)].filter(
    skill => !text.includes(skill)
  );

  document.getElementById("result").innerHTML = `
    <h3>🚨 Missing Skills</h3>
    <p>${missing.length ? missing.join(", ") : "None 🎉"}</p>
    ${generateRoadmap(missing)}
  `;
}