using System;
using System.Linq.Expressions;

namespace PW.Application.Repositories;

public interface IRepository<T> where T : class
    {
        // Tek bir entity getir
        Task<T> GetByIdAsync(Guid id);

        // Tüm entity’leri getir
        Task<IEnumerable<T>> GetAllAsync();

        // Filtreleme ile getir
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        // Ekle
        Task AddAsync(T entity);

        // Güncelle
        void Update(T entity);

        // Sil
        void Remove(T entity);
    }
