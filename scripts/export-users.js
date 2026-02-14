const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${users.length} users.`);

    const csvHeader = 'Name,Email,Joined At,Image URL\n';
    const csvRows = users.map(user => {
        // Escape quotes in names
        const name = user.name ? user.name.replace(/"/g, '""') : '';
        const email = user.email || '';
        const date = user.createdAt ? new Date(user.createdAt).toISOString() : '';
        const image = user.image || '';

        return `"${name}","${email}","${date}","${image}"`;
    });

    const csvContent = csvHeader + csvRows.join('\n');
    const outputPath = path.join(__dirname, '..', 'user-emails.csv');

    fs.writeFileSync(outputPath, csvContent);
    console.log(`\nSuccess! Exported ${users.length} users to:`);
    console.log(outputPath);
}

main()
    .catch((e) => {
        console.error('Error exporting users:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
