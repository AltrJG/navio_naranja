# Generated by Django 5.0.3 on 2024-11-23 02:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('navio_naranja_app', '0009_rename_purchase_date_purchase_created_at_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='StockNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('threshold', models.PositiveIntegerField(default=10)),
                ('resolved', models.BooleanField(default=False)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='low_stock_notifications', to='navio_naranja_app.product')),
            ],
        ),
    ]
